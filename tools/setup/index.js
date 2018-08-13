'use strict';

/**
 * Start the OpenST Setup step-by-step
 */
const program = require('commander');

const rootPrefix = '../..',
  logger = require(rootPrefix + '/helpers/custom_console_logger'),
  InstanceComposer = require(rootPrefix + '/instance_composer');

// registering following files in Instance Composer
require(rootPrefix + '/tools/setup/performer');

/**
 * Perform a particular step in the installation. If step is not passed the whole installation will be done from scratch.
 *
 * @param {string} step - step of the setup to run.
 * @param {object} config - config to use for the setup.
 * @param {object} utilityConfigFilePath - config file path per which UC(s) would be Setup.
 *
 * @return {promise}
 */
const run = async function(step, config, utilityConfigs) {
  const instanceComposer = new InstanceComposer(config || {}),
    performer = instanceComposer.getOpenSTSetup();

  logger.step('** Setup START for step:', step);

  await performer.perform(step, { utility_configs: utilityConfigs });

  logger.win('** Setup DONE for step:', step);
  logger.win('** Exiting...');
  process.exit(0);
};

program
  .description('Setup OpenST-Platform')
  .option(
    '-s, --step <step>',
    'Step to be performed. (all|fresh_setup|generate_addresses|init_value_chain|init_utility_chain|dynamo_db_shard_management|dynamo_db_register_shards|st_contract|fund_users_with_st|deploy_value_chain|deploy_utility_chain|snm_intercomm|snmp_intercomm|st_prime_mint|end)',
    /^(all|fresh_setup|generate_addresses|init_value_chain|init_utility_chain|dynamo_db_shard_management|dynamo_db_register_shards|st_contract|fund_users_with_st|deploy_value_chain|deploy_utility_chain|snm_intercomm|snmp_intercomm|st_prime_mint|end)$/i,
    'all'
  )
  .option('-c, --config <path>', 'Json Config file path.')
  .option(
    '-u, --utility-config-file-path <path>',
    'Json file path for utility chain Config. Would Contain each value would have config for each UC to be setup'
  );

program.parse(process.argv);

const step = program.step;
const config = program.config ? require(program.config) : {};
const utilityConfigs = program.utilityConfigFilePath ? require(program.utilityConfigFilePath) : {};
run(step || 'all', config, utilityConfigs);
