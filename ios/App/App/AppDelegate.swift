import UIKit
import Capacitor
import GoogleSignIn

final class GoogleSignInPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "GoogleSignInPlugin"
    public let jsName = "GoogleSignIn"
    public let pluginMethods = [
        CAPPluginMethod(name: "signInWithGoogle", returnType: CAPPluginReturnPromise)!
    ]

    @objc func signInWithGoogle(_ call: CAPPluginCall) {
        guard let plistURL = Bundle.main.url(forResource: "GoogleService-Info", withExtension: "plist"),
              let config = NSDictionary(contentsOf: plistURL),
              let clientID = config["CLIENT_ID"] as? String else {
            call.reject("GoogleService-Info.plist is missing or has no CLIENT_ID.")
            return
        }

        GIDSignIn.sharedInstance.configuration = GIDConfiguration(clientID: clientID)
        guard let presentingViewController = bridge?.viewController else {
            call.reject("Unable to present Google sign-in.")
            return
        }

        GIDSignIn.sharedInstance.signIn(withPresenting: presentingViewController) { result, error in
            if let error = error {
                call.reject(error.localizedDescription)
                return
            }
            guard let result = result,
                  let idToken = result.user.idToken?.tokenString else {
                call.reject("Google sign-in did not return an ID token.")
                return
            }

            call.resolve([
                "credential": [
                    "idToken": idToken,
                    "accessToken": result.user.accessToken.tokenString
                ]
            ])
        }
    }
}

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // Override point for customization after application launch.
        return true
    }

    func applicationWillResignActive(_ application: UIApplication) {
        // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
        // Use this method to pause ongoing tasks, disable timers, and invalidate graphics rendering callbacks. Games should use this method to pause the game.
    }

    func applicationDidEnterBackground(_ application: UIApplication) {
        // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
        // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
    }

    func applicationWillEnterForeground(_ application: UIApplication) {
        // Called as part of the transition from the background to the active state; here you can undo many of the changes made on entering the background.
    }

    func applicationDidBecomeActive(_ application: UIApplication) {
        // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
    }

    func applicationWillTerminate(_ application: UIApplication) {
        // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
    }

    func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
        // Called when the app was launched with a url. Feel free to add additional processing here,
        // but if you want the App API to support tracking app url opens, make sure to keep this call
        let googleHandled = GIDSignIn.sharedInstance.handle(url)
        let capacitorHandled = ApplicationDelegateProxy.shared.application(app, open: url, options: options)
        return googleHandled || capacitorHandled
    }

    func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
        // Called when the app was launched with an activity, including Universal Links.
        // Feel free to add additional processing here, but if you want the App API to support
        // tracking app url opens, make sure to keep this call
        return ApplicationDelegateProxy.shared.application(application, continue: userActivity, restorationHandler: restorationHandler)
    }

}

final class SceneDelegate: UIResponder, UIWindowSceneDelegate {
    var window: UIWindow?

    func scene(
        _ scene: UIScene,
        willConnectTo session: UISceneSession,
        options connectionOptions: UIScene.ConnectionOptions
    ) {
        SceneDelegateProxy.shared.scene(scene, willConnectTo: session, options: connectionOptions)
    }

    func scene(_ scene: UIScene, openURLContexts URLContexts: Set<UIOpenURLContext>) {
        URLContexts.forEach { _ = GIDSignIn.sharedInstance.handle($0.url) }
        SceneDelegateProxy.shared.scene(scene, openURLContexts: URLContexts)
    }

    func scene(_ scene: UIScene, continue userActivity: NSUserActivity) {
        SceneDelegateProxy.shared.scene(scene, continue: userActivity)
    }
}

final class AppViewController: CAPBridgeViewController {
    override func capacitorDidLoad() {
        super.capacitorDidLoad()

        if bridge?.plugin(withName: "GoogleSignIn") == nil {
            bridge?.registerPluginInstance(GoogleSignInPlugin())
        }
    }
}
