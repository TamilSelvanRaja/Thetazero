import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:sample_app_test1/ui/home/splash.dart';
import 'package:sample_app_test1/utils/app_dependency.dart';

void main() {
  CustomDependency.initialDependecy();
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return GetMaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: const Spalsh(),
    );
  }
}
