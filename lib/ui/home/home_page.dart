import 'dart:developer';

import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:sample_app_test1/constants/ui_helper.dart';
import 'package:sample_app_test1/controller/home_controller.dart';
import 'package:sample_app_test1/ui/home/product_details.dart';
import 'package:sample_app_test1/ui/home/widgets/add_button.dart';
import 'package:sample_app_test1/ui/home/widgets/search_bar.dart';

class MyHomePage extends StatelessWidget {
  MyHomePage({super.key, required this.title});
  final String title;
  final HomeController homecontroller = Get.find<HomeController>();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        title: Text(title),
      ),
      backgroundColor: Colors.white,
      body: GestureDetector(
        onTap: () => FocusScope.of(context).unfocus(),
        child: GetBuilder<HomeController>(initState: (state) {
          homecontroller.filterProducts("");
        }, builder: (controller) {
          return Container(
            margin: const EdgeInsets.symmetric(vertical: 16),
            child: Center(
              child: Column(
                children: [
                  Container(
                    margin: const EdgeInsets.symmetric(horizontal: 16),
                    child: SearchField(
                      hintText: "Search product",
                      onEnter: (value) {
                        homecontroller.filterProducts(value.toString());
                      },
                    ),
                  ),
                  UIHelper.verticalSpaceSmall,
                  Expanded(
                      child: SingleChildScrollView(
                    child: Obx(
                      () => homecontroller.productList.isNotEmpty
                          ? Wrap(
                              spacing: 10,
                              runSpacing: 10,
                              children: List.generate(homecontroller.productList.length, (index) {
                                dynamic productData = homecontroller.productList[index];
                                return productContainer(productData, index);
                              }),
                            )
                          : const SizedBox(),
                    ),
                  )),
                ],
              ),
            ),
          );
        }),
      ),
    );
  }

  Widget productContainer(dynamic productData, int index) {
    return GestureDetector(
      onTap: () {
        Get.to(() => DetailsPage(productData: productData));
      },
      child: Container(
        height: 220,
        width: Get.width / 2.3,
        padding: const EdgeInsets.symmetric(horizontal: 10),
        decoration: UIHelper.roundedBorderWithColor(15, Colors.white, borderColor: Colors.grey),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Image.asset(productData['product_image'][0], height: 80),
            UIHelper.verticalSpaceSmall,
            Text(
              "${productData['product_name']}",
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            UIHelper.verticalSpaceSmall,
            Row(
              children: [
                const Text("Price : ", style: TextStyle(fontSize: 16, color: Colors.grey, fontWeight: FontWeight.bold)),
                Text("₹ ${productData['product_price']}", style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
              ],
            ),
            UIHelper.verticalSpaceSmall,
            GetBuilder<HomeController>(builder: (controller) {
              return Obx(() {
                List requestData = controller.cartList.where((e) => e['product_id'] == productData['product_id']).toList();
                String count = "";
                if (requestData.isNotEmpty) {
                  log("$requestData");
                  count = requestData[0]['count'].toString();
                }
                return requestData.isEmpty
                    ? AddItemsButton(onTap: () {
                        controller.cartAddFunction(productData['product_id']);
                      })
                    : AddMoreItemsButton(
                        label: Text("${count}", style: const TextStyle(fontSize: 18, color: Colors.green, fontWeight: FontWeight.bold)),
                        onIncrement: () {
                          controller.cartAddFunction(productData['product_id']);
                        },
                        ondecrement: () {},
                      );
              });
            })
          ],
        ),
      ),
    );
  }
}
