import 'package:get/get.dart';
import 'package:promilo/features/login_screen.dart';

class RoutePath {
  static dynamic signin = '/';
}

abstract class AppPages {
  static final pages = [
    GetPage(
      name: RoutePath.signin,
      page: () => const LoginScreenView(),
    ),
    //  GetPage(name: RoutePath.signin, page: () => const SignInScreen(), transition: Transition.circularReveal, transitionDuration: const Duration(seconds: 1), curve: Curves.easeInOut, bindings: [
    //     BindingsBuilder(() {
    //       Get.put(UserController(), permanent: true);
    //     }),
    //   ]),
  ];
}
