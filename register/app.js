let config = require('config-lite')(__dirname);

const os = require('os');

function getIPAdress() {
  let interfaces = os.networkInterfaces();
  for (let devName in interfaces) {
    let iface = interfaces[devName];
    for (let i = 0; i < iface.length; i++) {
      let alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.address;
      }
    }
  }
}
config.interface = getIPAdress();
config.hostname = os.hostname()

const consul = require('consul')({
  host: "10.0.234.225",
  port: "8500"
});

const CONSUL_ID = `${config.interface}-${config.hostname}`;

let details = {
  name: config.category,
  address: config.interface,
  tags:[config.tag],
  meta: config,
  check: {
    ttl: '10s',
    deregister_critical_service_after: '1m'
  },
  id: CONSUL_ID
};

consul.agent.service.register(details, (err, xyz) => {
  if (err) {
    throw new Error(err);
  }
  console.log('registered with Consul');

  setInterval(() => {
    consul.agent.check.pass({id:`service:${CONSUL_ID}`}, err => {
      if (err) throw new Error(err);
      //console.log('told Consul that we are healthy');
    });
  }, 5 * 1000);

  process.on('SIGINT', () => {
    console.log('SIGINT. De-Registering...');
    let details = {id: CONSUL_ID};
    consul.agent.service.deregister(details, (err) => {
      console.log('de-registered.', err);
      process.exit();
    });
  });
});


// Keep a list of healthy services
let watcher = consul.watch({
  method: consul.health.service,
  options: {
    service:'data',
    passing:true
  }
});

watcher.on('change', data => {
  console.log('received discovery update:', data.length);
  known_data_instances = [];

  data.forEach(entry => {
    known_data_instances.push(`http://${entry.Service.Address}:${entry.Service.Port}/`);
  });
});

watcher.on('error', err => {
  console.error('watch error', err);
});