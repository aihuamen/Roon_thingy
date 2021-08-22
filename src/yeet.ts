import * as dotenv from 'dotenv'
import chalk from 'chalk'
import RoonApi, { Core } from 'node-roon-api'
import RoonApiStatus from 'node-roon-api-status'
import RoonApiTransport from 'node-roon-api-transport'
import RoonApiSettings from 'node-roon-api-settings'
import RoonApiBrowse from 'node-roon-api-browse'
import { promisify } from 'util'

dotenv.config()

let item_key = "2:0"
let _core: Core | undefined

const roon = new RoonApi({
  extension_id: 'com.aihuamen.test',
  display_name: "aihuamen's First Roon API Test",
  display_version: "1.0.0",
  publisher: 'Yama K',
  email: 'yama@email.com',
  website: 'https://github.com/aihuamen/Roon_thingy',

  core_paired: async (core) => {
    _core = core
    const transport = core.services.RoonApiTransport;
    const browse = core.services.RoonApiBrowse
   
    if(browse) {
      // const body = await promisify(browse.browse).bind(browse)({ hierarchy: 'browse', item_key})
      // console.log(body)
      const body2 = await promisify(browse.load).bind(browse)({hierarchy: 'browse', offset: 0, set_display_offset: 0})
      console.log(body2)
    }

    if(transport) {
      transport.subscribe_zones((cmd, data) => {
        console.log(
          chalk.green(
            "My log:",
            `${core.core_id} ${core.display_name} ${core.display_version} - ${cmd}`
          )
        )
        console.log(chalk.yellow(JSON.stringify(data, null, 2)));
  
        if(cmd === "Changed") {
  
        }
  
      });
    }
    
  },
  core_unpaired: (core) => { 
    _core = undefined
    console.log(
      core.core_id,
      core.display_name, 
      core.display_version, 
      "-", "LOST"
      ); 
  }
})

const status = new RoonApiStatus(roon)
let my_settings = roon.load_config("setting") || {}

const svc_settings = new RoonApiSettings(roon, {
  get_settings: (cb) => {
    console.log("My settings:",my_settings)
    cb(makeLayout(my_settings))
  },
  save_settings: (req, isdryrun, settings) => {
    const l = makeLayout(settings.values)
    console.log(settings)

    req.send_complete(l.has_error ? "NotValid" : "Success", { settings: l });

    if (!isdryrun && !l.has_error) {
      my_settings = l.values;
      svc_settings.update_settings(l);
      roon.save_config("settings", my_settings);
    }
  }
})

roon.init_services({
  required_services: [RoonApiTransport, RoonApiBrowse],
  provided_services: [status, svc_settings]
})
status.set_status('yee', false)
roon.start_discovery()

const makeLayout = (setting: Record<string,any>) => {
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