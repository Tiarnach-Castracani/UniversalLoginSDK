import {EventEmitter} from 'fbemitter';
import EthereumIdentitySDK from 'universal-login-sdk';
import {providers} from 'ethers';
import config, {clickerContractAddress, tokenContractAddress} from '../../config/config';
import IdentityService from './IdentityService';
import ClickService from './ClickService';
import HistoryService from './HistoryService';
import EnsService from './EnsService';
import EnsNameService from './EnsNameService';
import AuthorisationService from './AuthorisationService';
import TokenService from './TokenService';
import IdentitySelectionService from './IdentitySelectionService';
import BackupService from './BackupService';
import GreetingService from './GreetingService';
import StorageService from './StorageService';
import SuggestionsService from './SuggestionsService';
import DEFAULT_PAYMENT_OPTIONS from '../../config/defaultPaymentOptions';


class Services {
  constructor() {
    this.config = config;
    this.defaultPaymentOptions = DEFAULT_PAYMENT_OPTIONS;
    this.emitter = new EventEmitter();
    this.provider = new providers.JsonRpcProvider(this.config.jsonRpcUrl);
    this.sdk = new EthereumIdentitySDK(this.config.relayerUrl, this.provider);
    this.ensService = new EnsService(this.sdk, this.provider);
    this.tokenService = new TokenService(tokenContractAddress, this.provider);
    this.storageService = new StorageService();
    this.identityService = new IdentityService(this.sdk, this.emitter, this.storageService, this.provider);
    this.backupService = new BackupService(this.identityService);
    this.clickService = new ClickService(this.identityService, {clicker: clickerContractAddress, token: tokenContractAddress}, this.defaultPaymentOptions);
    this.historyService = new HistoryService(clickerContractAddress, this.provider, this.ensService);
    this.ensNameService = new EnsNameService(this.ensService, this.historyService);
    this.authorisationService = new AuthorisationService(this.sdk, this.emitter);
    this.identitySelectionService = new IdentitySelectionService(this.sdk, config.ensDomains);
    this.greetingService = new GreetingService(this.provider);
    this.suggestionsService = new SuggestionsService(this.identitySelectionService);
  }

  start() {
    this.sdk.start();
    return this.identityService.loadIdentity();
  }

  stop() {
    this.sdk.stop();
  }
}

export default Services;
