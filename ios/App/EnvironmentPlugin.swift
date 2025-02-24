import Foundation
import Capacitor

@objc(EnvironmentPlugin)
public class EnvironmentPlugin: CAPPlugin {
    @objc func getEnvironment(_ call: CAPPluginCall) {
        let environment = UserDefaults.standard.string(forKey: "selectedEnvironment") ?? "production"
        call.resolve([
            "environment": environment
        ])
    }
}
