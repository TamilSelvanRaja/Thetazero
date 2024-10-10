import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:sample_app_test1/constants/ui_helper.dart';
import 'package:sample_app_test1/controller/home_controller.dart';

class CartItemsAddRemove extends StatelessWidget {
  const CartItemsAddRemove({super.key, required this.productId});
  final int productId;

  @override
  Widget build(BuildContext context) {
    return GetBuilder<HomeController>(builder: (controller) {
      return Obx(() {
        List requestData = controller.cartList.where((e) => e['product_id'] == productId).toList();
        String count = "";
        if (requestData.isNotEmpty) {
          count = requestData[0]['count'].toString();
        }
        return requestData.isEmpty
            ? AddItemsButton(onTap: () {
                controller.cartAddFunction(productId);
              })
            : AddMoreItemsButton(
                label: Text(count, style: const TextStyle(fontSize: 15, color: Colors.green, fontWeight: FontWeight.bold)),
                onIncrement: () {
                  controller.cartAddFunction(productId);
                },
                ondecrement: () {
                  controller.cartreduceItemFunction(productId);
                },
              );
      });
    });
  }
}

class AddItemsButton extends StatelessWidget {
  const AddItemsButton({
    super.key,
    required this.onTap,
  });
  final VoidCallback onTap;
  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        height: 30,
        alignment: Alignment.center,
        decoration: UIHelper.roundedBorderWithColor(5, Colors.transparent, borderColor: Colors.green),
        child: const Text(
          "Add",
          style: TextStyle(fontSize: 15, color: Colors.green, fontWeight: FontWeight.bold),
        ),
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
          IconButton(padding: const EdgeInsets.all(0), onPressed: ondecrement, icon: const Icon(Icons.remove, color: Colors.green, size: 14)),
          label,
          IconButton(padding: const EdgeInsets.all(0), onPressed: onIncrement, icon: const Icon(Icons.add, color: Colors.green, size: 14)),
        ],
      ),
    );
  }
}
