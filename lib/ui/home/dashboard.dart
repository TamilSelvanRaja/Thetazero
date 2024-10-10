import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:sample_app_test1/controller/home_controller.dart';
import 'package:sample_app_test1/ui/home/cart_page.dart';
import 'package:sample_app_test1/ui/home/home_page.dart';

class DashboardView extends StatefulWidget {
  const DashboardView({super.key});

  @override
  State<DashboardView> createState() => _DashboardViewState();
}

class _DashboardViewState extends State<DashboardView> {
  final HomeController homecontroller = Get.find<HomeController>();
  int selectedIndex = 0;
  final List navigationItems = [
    {"title": "Home", "icon": const Icon(Icons.home_outlined, size: 30)},
  ];

  static final List<Widget> _widgetOptions = <Widget>[MyHomePage(), CartPage()];

  @override
  void initState() {
    super.initState();
  }

  initialization() {
    navigationItems.removeWhere((e) => e['title'] == "Cart");
    navigationItems.add({
      "title": "Cart",
      "icon": Obx(() => Column(
            children: [
              homecontroller.cartList.isNotEmpty
                  ? Text(
                      "${homecontroller.cartList.length}",
                      style: const TextStyle(color: Colors.red, fontWeight: FontWeight.bold),
                    )
                  : const SizedBox(),
              const Icon(Icons.shopping_cart_outlined, size: 30),
            ],
          ))
    });
  }

  @override
  Widget build(BuildContext context) {
    initialization();
    const Color inActiveIconColor = Color(0xFFB6B6B6);
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        title: const Text('Thetazero Assessment'),
      ),
      body: _widgetOptions.elementAt(selectedIndex),
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          boxShadow: [
            BoxShadow(
              blurRadius: 20,
              color: Colors.black.withOpacity(.1),
            )
          ],
        ),
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 0, vertical: 0),
            child: BottomNavigationBar(
              elevation: 0,
              iconSize: 20,
              showSelectedLabels: true,
              showUnselectedLabels: false,
              selectedLabelStyle: const TextStyle(fontSize: 12),
              items: List.generate(
                navigationItems.length,
                (index) => BottomNavigationBarItem(
                  icon: navigationItems[index]['icon'],
                  label: navigationItems[index]['title'],
                ),
              ),
              currentIndex: selectedIndex,
              selectedItemColor: Colors.green,
              unselectedItemColor: inActiveIconColor,
              onTap: (index) {
                selectedIndex = index;
                setState(() {});
              },
            ),
          ),
        ),
      ),
    );
  }
}
