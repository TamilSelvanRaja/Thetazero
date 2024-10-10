import 'package:carousel_slider/carousel_slider.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:sample_app_test1/constants/app_variables.dart';
import 'package:sample_app_test1/constants/ui_helper.dart';
import 'package:sample_app_test1/controller/home_controller.dart';
import 'package:sample_app_test1/ui/home/widgets/rating.dart';

class DetailsPage extends StatelessWidget {
  DetailsPage({super.key, this.productData});
  final dynamic productData;
  final HomeController homecontroller = Get.find<HomeController>();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
          top: true,
          child: Container(
            padding: const EdgeInsets.all(16),
            child: SingleChildScrollView(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.start,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Text("${productData['title1']}", style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: Colors.green)),
                      const Spacer(),
                      Stars(rating: productData['rating']),
                      UIHelper.horizantalSpaceSmall,
                      Text(
                        "${productData['rating']}",
                        style: const TextStyle(color: Colors.orange),
                      ),
                    ],
                  ),
                  Text("${productData['title2']}", style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w400)),
                  Text("Past 2 months bought ${productData['buyers']} buyers", style: const TextStyle(color: Colors.brown, fontWeight: FontWeight.w400)),
                  UIHelper.verticalSpaceMedium,
                  CarouselSlider.builder(
                    itemCount: productData['product_image'].length,
                    options: CarouselOptions(
                      autoPlay: true,
                      enlargeCenterPage: true,
                      height: 200,
                      viewportFraction: 1,
                      onPageChanged: (index, reason) {
                        homecontroller.currentIndex.value = index;
                      },
                    ),
                    itemBuilder: (context, index, realIndex) {
                      String imgUrl = productData['product_image'][index];
                      return Container(
                        width: Get.width / 1.5,
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(10),
                          image: DecorationImage(
                            image: AssetImage(imgUrl),
                            fit: BoxFit.cover,
                          ),
                        ),
                      );
                    },
                  ),
                  UIHelper.verticalSpaceMedium,
                  Obx(
                    () => productData['product_image'].length > 0
                        ? Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: List.generate(
                              productData['product_image'].length,
                              (index) => buildDot(index: index, homecontroller.currentIndex.value),
                            ),
                          )
                        : const SizedBox(),
                  ),
                  UIHelper.verticalSpaceSmall,
                  Center(
                    child: Text(
                      "${productData['product_name']}",
                      style: const TextStyle(fontSize: 25, fontWeight: FontWeight.bold),
                    ),
                  ),
                  UIHelper.verticalSpaceSmall,
                  Row(
                    children: [
                      const Text("Price : ", style: TextStyle(fontSize: 16, color: Colors.grey, fontWeight: FontWeight.bold)),
                      Text("₹ ${productData['product_price']}", style: const TextStyle(fontSize: 25, color: Colors.red, fontWeight: FontWeight.bold)),
                    ],
                  ),
                  UIHelper.verticalSpaceMedium,
                  const Text(
                    "Product Details",
                    style: TextStyle(color: Colors.green, fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: AppVaiables.productDetails.entries.map((entry) {
                      return Row(
                        children: [
                          Expanded(
                            flex: 2,
                            child: Text(entry.key, style: const TextStyle(color: Colors.grey)),
                          ),
                          const Expanded(
                            flex: 1,
                            child: Text(":", style: TextStyle(color: Colors.grey)),
                          ),
                          Expanded(flex: 2, child: Text(entry.value))
                        ],
                      );
                    }).toList(),
                  ),
                  UIHelper.verticalSpaceMedium,
                  Center(
                    child: ElevatedButton(
                      onPressed: () {},
                      style: const ButtonStyle(backgroundColor: WidgetStatePropertyAll(Colors.green)),
                      child: const Text(
                        "Add to cart",
                        style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
                      ),
                    ),
                  ),
                  UIHelper.verticalSpaceMedium,
                ],
              ),
            ),
          )),
    );
  }

  AnimatedContainer buildDot(currentPage, {int? index}) {
    return AnimatedContainer(
      duration: const Duration(milliseconds: 200),
      margin: const EdgeInsets.only(right: 5),
      height: 6,
      width: currentPage == index ? 20 : 6,
      decoration: BoxDecoration(
        color: currentPage == index ? Colors.green : const Color(0xFFD8D8D8),
        borderRadius: BorderRadius.circular(3),
      ),
    );
  }
}
