import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:sample_app_test1/ui/home/dashboard.dart';

class Spalsh extends StatefulWidget {
  const Spalsh({super.key});

  @override
  State<Spalsh> createState() => SpalshState();
}

class SpalshState extends State<Spalsh> {
  @override
  void initState() {
    Future.delayed(const Duration(seconds: 2), () {
      Get.to(const DashboardView());
    });
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      backgroundColor: Colors.white,
      body: Center(
        child: Text("Loading..."),
      ),
    );
  }
}
