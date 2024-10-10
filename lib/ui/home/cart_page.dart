import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:sample_app_test1/constants/ui_helper.dart';
import 'package:sample_app_test1/controller/home_controller.dart';
import 'package:sample_app_test1/ui/home/widgets/add_button.dart';
import 'package:sample_app_test1/ui/home/widgets/rating.dart';

class CartPage extends StatelessWidget {
  CartPage({super.key});
  final HomeController homecontroller = Get.find<HomeController>();
  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => FocusScope.of(context).unfocus(),
      child: GetBuilder<HomeController>(builder: (controller) {
        return Container(
          margin: const EdgeInsets.all(16),
          child: SingleChildScrollView(
            child: Obx(
              () => controller.cartList.isNotEmpty
                  ? Column(
                      children: [
                        Column(
                          children: List.generate(controller.cartList.length, (index) {
                            return productContainer(controller.cartList[index]['product_id'], controller.cartList[index]['count']);
                          }),
                        ),
                        priceDetailsWidget(),
                      ],
                    )
                  : const Center(
                      child: Text(
                        "Cart is Empty",
                        style: TextStyle(fontSize: 20, color: Colors.red),
                      ),
                    ),
            ),
          ),
        );
      }),
    );
  }

  Widget productContainer(dynamic productId, int count) {
    dynamic productData = HomeController().getProductDetails(productId)[0];
    return Stack(
      children: [
        Container(
          width: Get.width,
          padding: const EdgeInsets.all(10),
          margin: const EdgeInsets.only(bottom: 10),
          decoration: UIHelper.roundedBorderWithColor(15, Colors.white, borderColor: Colors.grey),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.start,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Image.asset(productData['product_image'][0], height: 80),
                  UIHelper.horizantalSpaceMedium,
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        "${productData['product_name']}",
                        style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                      ),
                      Text(
                        "${productData['title1']}",
                        style: const TextStyle(fontSize: 14, color: Colors.green),
                      ),
                      Text(
                        "${productData['title2']}",
                        style: const TextStyle(fontSize: 14, color: Colors.brown),
                      ),
                      Row(
                        children: [
                          const Text("Price : ", style: TextStyle(fontSize: 16, color: Colors.grey, fontWeight: FontWeight.bold)),
                          Text("₹ ${productData['product_price']}", style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                        ],
                      ),
                    ],
                  )
                ],
              ),
              UIHelper.verticalSpaceSmall,
              SizedBox(
                width: 150,
                child: CartItemsAddRemove(
                  productId: productData['product_id'],
                ),
              ),
              UIHelper.verticalSpaceSmall,
            ],
          ),
        ),
        Positioned(
          right: 10,
          top: 10,
          child: Row(
            children: [
              Stars(rating: productData['rating']),
              UIHelper.horizantalSpaceSmall,
              Text(
                "${productData['rating']}",
                style: const TextStyle(color: Colors.orange),
              ),
            ],
          ),
        )
      ],
    );
  }

  Widget priceDetailsWidget() {
    return Column(
      children: [
        UIHelper.verticalSpaceMedium,
        Container(height: 1, color: Colors.green.withOpacity(0.5)),
        UIHelper.verticalSpaceSmall,
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text("Total Price : ", style: TextStyle(fontSize: 16, color: Colors.grey, fontWeight: FontWeight.bold)),
            Text("₹ ${homecontroller.total}", style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
          ],
        ),
        UIHelper.verticalSpaceSmall,
      ],
    );
  }
}
