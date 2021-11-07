import chalk from "chalk"
import RoonApi, { Core } from "node-roon-api"
import RoonApiBrowse from "node-roon-api-browse"
import RoonApiImage, { ImageOption } from "node-roon-api-image"
import RoonApiSettings from "node-roon-api-settings"
import RoonApiStatus from "node-roon-api-status"
import RoonApiTransport, { RoonData, Zone, MusicStatus } from "node-roon-api-transport"
import { promisify } from "util"

export interface SettingConfig {
  zone: {
    output_id: string
    name: string
  }
}

export interface ImageResult {
  type: string
  image: Buffer
}

export interface CurrentSong extends MusicStatus {
  title: string;
  artist: string;
  album: string;
}

export const IMAGE_OPTION_DEFAULT: ImageOption = {
  scale: 'fit',
  width: 300,
  height: 300,
};

export class RoonService {
  private static mInstance: RoonService 
  private roon: RoonApi
  private core!: Core
  private status: RoonApiStatus
  private transport?: RoonApiTransport
  private browse?: RoonApiBrowse
  private image?: RoonApiImage
  private zones?: Zone[]

  public currentSong?: CurrentSong;

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
        self.image = core.services.RoonApiImage

        if(self.transport) {
          self.transport.subscribe_zones((cmd, data) => {
            console.log(
              chalk.green(
                "My log:",
                `${self.core.core_id} ${self.core.display_name} ${self.core.display_version} - ${cmd}`
              )
            )
            console.log(chalk.yellow(JSON.stringify(data, null, 2)));
            self.onTransportChanged(cmd, data);
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
      required_services: [RoonApiTransport, RoonApiBrowse, RoonApiImage],
      provided_services: [this.status, svc_settings]
    })

    this.status.set_status('yee', false)
    this.roon.start_discovery()
  }

  public get currentZone() {
    const setting = this.roon.load_config<SettingConfig>('settings')
    if(!setting.zone) return null
    return this.zones!.filter(z => z.display_name === setting.zone.name)[0]
  }

  public get currentOutput() {
    const setting = this.roon.load_config<SettingConfig>('settings')
    if(!setting.zone) return
    return this.zones!.flatMap(z => z.outputs).filter(o => o.display_name === setting.zone.name)[0]
  }

  setStatus = (status: string) => this.status.set_status(status, false)
  
  play = () => this.transport!.control(this.currentZone!, 'play')

  pause = () => this.transport!.control(this.currentZone!, 'pause')

  togglePlayPause = () => this.transport!.control(this.currentZone!, 'playpause')

  stop = () => this.transport!.control(this.currentZone!, 'stop')

  previous = () => this.transport!.control(this.currentZone!, 'previous')

  next = () => this.transport!.control(this.currentZone!, 'next')
  
  mute = () => this.transport!.mute(this.currentOutput!, 'mute')
  
  unmute = () => this.transport!.mute(this.currentOutput!, 'unmute')

  shuffle = () => this.transport?.change_settings(this.currentOutput!, { shuffle: true });
  
  doBrowse = (item_key: string) => promisify(this.browse!.browse).bind(this.browse)({ hierarchy: 'browse', item_key })
  
  doLoad = () => promisify(this.browse!.load).bind(this.browse)({ hierarchy: 'browse', offset: 0, set_display_offset: 0 })

  getImage(image_key: string, options: ImageOption = IMAGE_OPTION_DEFAULT) {
    return new Promise<ImageResult>((resolve, reject) => {
      this.image!.get_image(image_key, options, (err, type, image) => {
        if(err) {
          return reject(err)
        }
        resolve({type, image})
      })
    })
  }
  
  private makeLayout(setting: Record<string,any>) {
    const l = {
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

  private onTransportChanged(cmd: string, data: RoonData) {
    if (cmd === 'Subscribed') {
      this.zones = data.zones!;
      const { now_playing } = this.currentZone!;
      this.setCurrentSongFromMusicStatus(now_playing);
    } else if (
      cmd === 'Changed' &&
      data.zones_seek_changed &&
      this.currentSong
    ) {
      this.currentSong.seek_position = data.zones_seek_changed[0].seek_position;
    } else if (cmd === 'Changed' && data.zones_changed) {
      const { now_playing } = data.zones_changed[0];
      this.setCurrentSongFromMusicStatus(now_playing);
    }
  }

  private setCurrentSongFromMusicStatus(now: MusicStatus) {
    const { line1, line2, line3 } = now.three_line;
    this.currentSong = {
      ...now,
      title: line1,
      artist: line2,
      album: line3,
    };
  }
}
