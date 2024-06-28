import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:promilo/features/login/login_screen.dart';
import 'package:promilo/features/home/landing_screen.dart';

class RoutePath {
  static dynamic signin = '/';
  static dynamic landing = '/landing';
}

abstract class AppPages {
  static final pages = [
    GetPage(
      name: RoutePath.signin,
      page: () => const LoginScreenView(),
    ),
    GetPage(
      name: RoutePath.landing,
      page: () => const LandingView(),
      transition: Transition.circularReveal,
      transitionDuration: const Duration(seconds: 1),
      curve: Curves.easeInOut,
    ),
  ];
}
