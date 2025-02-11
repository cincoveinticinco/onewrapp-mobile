#import <Foundation/Foundation.h>
#import <Capacitor/Capacitor.h>

CAP_PLUGIN(EnvironmentPlugin, "EnvironmentPlugin",
    CAP_PLUGIN_METHOD(getEnvironment, CAPPluginReturnPromise);
)