import "package:flutter/material.dart";
import 'package:promilo/constants/colors.dart' as clr;
import 'package:promilo/layouts/screen.dart';
import 'package:promilo/layouts/ui_helper.dart';
import 'package:promilo/constants/image_paths.dart';

class BottomNavBarView extends StatefulWidget {
  const BottomNavBarView({super.key, this.onselected});
  final dynamic onselected;

  @override
  State<BottomNavBarView> createState() => _BottomNavBarViewState();
}

class _BottomNavBarViewState extends State<BottomNavBarView> {
  int selectedIndex = 2;
  @override
  Widget build(BuildContext context) {
    List<NavBarItemData> items = [
      NavBarItemData(icon: homeImage, label: "Home"),
      NavBarItemData(icon: menuImage, label: "Prolet"),
      NavBarItemData(icon: meetImage, label: "Meetup"),
      NavBarItemData(icon: exploreImage, label: "Explore"),
      NavBarItemData(icon: userImage, label: "Account"),
    ];

    return BottomAppBar(
      color: clr.white,
      height: 60,
      padding: const EdgeInsets.only(top: 0),
      child: Column(
        children: [
          Container(height: 2, color: clr.grey01.withOpacity(0.2)),
          UiHelper.verticalSpaceTiny,
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: List.generate(items.length, (index) {
              var item = items[index];
              return GestureDetector(
                onTap: () {
                  selectedIndex = index;
                  setState(() {});
                },
                child: SizedBox(
                  width: Screen.width(context) / 5,
                  child: NavBarItem(
                    icon: item.icon,
                    label: item.label,
                    isSelected: index == selectedIndex,
                  ),
                ),
              );
            }),
          ),
        ],
      ),
    );
  }
}

class NavBarItemData {
  final String icon;
  final String label;

  NavBarItemData({required this.icon, required this.label});
}

class NavBarItem extends StatelessWidget {
  const NavBarItem({
    super.key,
    required this.icon,
    required this.label,
    required this.isSelected,
  });

  final String icon;
  final String label;
  final bool isSelected;

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Image.asset(
          icon,
          height: icon == meetImage ? 35 : 25,
          color: isSelected ? clr.activeColor : clr.black,
        ),
        UiHelper.customText(label, 14,
            color: isSelected ? clr.activeColor : clr.black,
            isBold: isSelected),
      ],
    );
  }
}
