import 'package:get/get.dart';
import 'package:sample_app_test1/controller/home_controller.dart';

class CustomDependency {
  static void initialDependecy() {
    Get.put(HomeController());
  }
}
