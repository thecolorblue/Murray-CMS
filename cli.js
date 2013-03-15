var program = require('commander');

function bootstrap() {
	
}

function view() {}

function module() {}

function api() {}

function packager() {}

program
  .version('0.2.1')
  .option('-b, --bootstrap', 'bootstrap new project',bootstrap)
  .option('-v, --view [name]', 'create new view',view)
  .option('-m, --module [name]', 'add new module',module)
  .option('-a, --api [name]', 'add new api', api)
  .option('-p, --package', 'package dependencies', packager)
  .parse(process.argv);