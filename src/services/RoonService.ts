import chalk from "chalk"
import RoonApi, { Core } from "node-roon-api"
import RoonApiBrowse from "node-roon-api-browse"
import RoonApiSettings from "node-roon-api-settings"
import RoonApiStatus from "node-roon-api-status"
import RoonApiTransport, { ControlType, RoonData, Zone } from "node-roon-api-transport"
import { promisify } from "util"

export interface SettingConfig {
  zone: {
    output_id: string
    name: string
  }
}

export class RoonService {
  private static mInstance: RoonService 
  private roon: RoonApi
  private core!: Core
  private status: RoonApiStatus
  private transport?: RoonApiTransport
  private browse?: RoonApiBrowse
  private zones?: Zone[]

  static getInstance() {
    if(!this.mInstance) {
      this.mInstance = new RoonService()
    }
    return this.mInstance
  }

  private constructor() {
    const self = this
    const roon = new RoonApi({
      extension_id: 'com.aihuamen.test',
      display_name: "aihuamen's First Roon API Test",
      display_version: "1.0.0",
      publisher: 'Yama K',
      email: 'yama@email.com',
      website: 'https://github.com/aihuamen/Roon_thingy',
    
      core_paired: core => {
        self.core = core
        self.transport = core.services.RoonApiTransport
        self.browse = core.services.RoonApiBrowse

        if(self.transport) {
          self.transport.subscribe_zones((cmd, data) => {
            console.log(
              chalk.green(
                "My log:",
                `${self.core.core_id} ${self.core.display_name} ${self.core.display_version} - ${cmd}`
              )
            )
            console.log(chalk.yellow(JSON.stringify(data, null, 2)));
            if(cmd === 'Subscribed') {
              self.zones = data.zones!
            }
            if(cmd === "Changed") {
              self.onTransportChanged(data)
            }
          });
        }
      },
      core_unpaired: core => {
        // self.core = undefined
        console.log(
          core.core_id,
          core.display_name, 
          core.display_version, 
          "-", "LOST"
        );
      }
    })
    
    this.roon = roon
    this.status = new RoonApiStatus(this.roon)
    let my_settings = this.roon.load_config<SettingConfig>("setting") || {}

    const svc_settings = new RoonApiSettings(this.roon, {
      get_settings: (cb) => {
        console.log("Current settings:",my_settings)
        cb(self.makeLayout(my_settings))
      },
      save_settings: (req, isdryrun, settings) => {
        const l = self.makeLayout(settings.values)
    
        req.send_complete(l.has_error ? "NotValid" : "Success", { settings: l });
    
        if (!isdryrun && !l.has_error) {
          my_settings = l.values as SettingConfig;
          console.log("New settings:",my_settings)
          svc_settings.update_settings(l);
          self.roon.save_config("settings", my_settings);
        }
      }
    })
    
    this.roon.init_services({
      required_services: [RoonApiTransport, RoonApiBrowse],
      provided_services: [this.status, svc_settings]
    })

    this.status.set_status('yee', false)
    this.roon.start_discovery()
  }

  private get currentZone() {
    const setting = this.roon.load_config<SettingConfig>('settings')
    if(!setting.zone) return
    return this.zones!.filter(z => z.display_name === setting.zone.name)[0]
  }

  private get currentOutput() {
    const setting = this.roon.load_config<SettingConfig>('settings')
    if(!setting.zone) return
    return this.zones!.flatMap(z => z.outputs).filter(o => o.display_name === setting.zone.name)[0]
  }

  setStatus(status: string) {
    this.status.set_status(status, false)
  }

  controlMusic(cmd: ControlType) {
    this.transport!.control(this.currentZone!, cmd)
  }

  muteMusic() {
    this.transport!.mute(this.currentOutput!, 'mute')
  }

  unmuteMusic() {
    this.transport!.mute(this.currentOutput!, 'unmute')
  }

  doBrowse(itemKey: string) {
    return promisify(this.browse!.browse).bind(this.browse)({ hierarchy: 'browse', itemKey })
  }

  doLoad() {
    return promisify(this.browse!.load).bind(this.browse)({ hierarchy: 'browse', offset: 0, set_display_offset: 0 })
  }

  private makeLayout(setting: Record<string,any>) {
    let l = {
      values: setting,
      layout: [] as any[],
      has_error: false,
    };
  
    l.layout.push({
      type: "label",
      title: "YEEEEEEEE",
    });
  
    l.layout.push({
      type: "zone",
      title: "Zone",
      setting: "zone",
    });
    return l;
  }

  private onTransportChanged(data: RoonData) {
    if(data.zones_seek_changed) {
      console.log('chageddddddd', data.zones_seek_changed[0].seek_position)
    }
  }
}
