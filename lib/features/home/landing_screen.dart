import 'package:flutter/material.dart';
import 'package:promilo/features/home/components/bottom_navbar.dart';
import 'package:promilo/features/home/meetup_screen.dart';

class LandingView extends StatefulWidget {
  const LandingView({super.key});
  @override
  State<LandingView> createState() => _LandingViewState();
}

class _LandingViewState extends State<LandingView> {
  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: SafeArea(top: true, child: MeetUpScreenView()),
      bottomNavigationBar: BottomNavBarView(),
    );
  }
}
