// Explicit known-visitor fixture for established world regression suites.
// New-visitor/state/blocked-storage tests run separately WITHOUT this preload.
// Explicit acknowledgment is seeded; legacy seen alone no longer bypasses onboarding.
import {createRequire} from 'node:module';
const {chromium}=createRequire(import.meta.url)('C:/Users/mi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const seed=()=>{localStorage.setItem('johnny-town.welcome.v1.seen','true');localStorage.setItem('johnny-town.welcome.acknowledged.v1','true');};
const launch=chromium.launch.bind(chromium);
chromium.launch=async(...args)=>{
 const browser=await launch(...args),newContext=browser.newContext.bind(browser),newPage=browser.newPage.bind(browser);
 browser.newContext=async(...options)=>{const context=await newContext(...options);await context.addInitScript(seed);return context;};
 browser.newPage=async(...options)=>{const page=await newPage(...options);await page.addInitScript(seed);return page;};
 return browser;
};
