import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:sample_app_test1/constants/ui_helper.dart';
import 'package:sample_app_test1/controller/home_controller.dart';
import 'package:sample_app_test1/ui/home/product_details.dart';
import 'package:sample_app_test1/ui/home/widgets/rating.dart';
import 'package:sample_app_test1/ui/home/widgets/search_bar.dart';

class MyHomePage extends StatelessWidget {
  MyHomePage({super.key});

  final HomeController homecontroller = Get.find<HomeController>();

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
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
                      controller.filterProducts(value.toString());
                    },
                  ),
                ),
                UIHelper.verticalSpaceSmall,
                Expanded(
                    child: SingleChildScrollView(
                  child: Obx(
                    () => controller.productList.isNotEmpty
                        ? Wrap(
                            spacing: 10,
                            runSpacing: 10,
                            children: List.generate(controller.productList.length, (index) {
                              dynamic productData = controller.productList[index];
                              return productContainer(productData);
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
    );
  }

  Widget productContainer(dynamic productData) {
    return GestureDetector(
      onTap: () {
        Get.to(() => DetailsPage(productData: productData));
      },
      child: Container(
        width: Get.width / 2.3,
        padding: const EdgeInsets.all(10),
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
            Text(
              "${productData['title2']}",
              style: const TextStyle(fontSize: 12, color: Colors.green, fontWeight: FontWeight.bold),
            ),
            UIHelper.verticalSpaceSmall,
            Row(
              children: [
                Stars(rating: productData['rating']),
                UIHelper.horizantalSpaceSmall,
                Text(
                  "${productData['rating']}",
                  style: const TextStyle(color: Colors.orange),
                ),
              ],
            )
          ],
        ),
      ),
    );
  }
}
