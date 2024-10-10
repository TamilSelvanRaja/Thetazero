import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:sample_app_test1/constants/ui_helper.dart';

class AddItemsButton extends StatelessWidget {
  const AddItemsButton({
    super.key,
    required this.onTap,
  });
  final VoidCallback onTap;
  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: onTap,
      style: ElevatedButton.styleFrom(
        backgroundColor: Colors.white,
        minimumSize: const Size(double.infinity, 30),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(5), // 15 pixel border radius
          side: const BorderSide(color: Colors.green, width: 1),
        ),
      ),
      child: const Text(
        "Add",
        style: TextStyle(fontSize: 16, color: Colors.green, fontWeight: FontWeight.bold),
      ),
    );
  }
}

class AddMoreItemsButton extends StatelessWidget {
  const AddMoreItemsButton({
    super.key,
    required this.onIncrement,
    required this.ondecrement,
    required this.label,
  });
  final VoidCallback onIncrement;
  final VoidCallback ondecrement;
  final Widget label;
  @override
  Widget build(BuildContext context) {
    return Container(
      height: 30,
      alignment: Alignment.center,
      decoration: UIHelper.roundedBorderWithColor(5, Colors.transparent, borderColor: Colors.green),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: [
          IconButton(padding: const EdgeInsets.all(0), onPressed: onIncrement, icon: const Icon(Icons.remove, color: Colors.green)),
          label,
          IconButton(padding: const EdgeInsets.all(0), onPressed: onIncrement, icon: const Icon(Icons.add, color: Colors.green)),
        ],
      ),
    );
  }
}
