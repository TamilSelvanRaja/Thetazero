import 'package:flutter/material.dart';
import 'package:flutter_form_builder/flutter_form_builder.dart';
import 'package:promilo/constants/colors.dart' as clr;
import 'package:promilo/layouts/ui_helper.dart';

class CustomInput extends StatefulWidget {
  final String lableText;
  final String hintText;
  final String fieldname;
  final String fieldType;
  final dynamic validating;
  final Function onEnter;
  final Widget? prefixwidget;
  final Widget? suffixWidget;

  const CustomInput({
    super.key,
    required this.hintText,
    required this.lableText,
    required this.fieldname,
    required this.validating,
    required this.fieldType,
    required this.onEnter,
    this.prefixwidget,
    this.suffixWidget,
  });
  @override
  State<CustomInput> createState() => _CustomInputState();
}

class _CustomInputState extends State<CustomInput> {
  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (widget.lableText.isNotEmpty) UiHelper.customText(widget.lableText, 17, isBold: true, color: clr.secondaryColor),
        if (widget.lableText.isNotEmpty) UiHelper.verticalSpaceSmall,
        FormBuilderTextField(
          style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w500, color: clr.black),
          name: widget.fieldname,
          autocorrect: false,
          autovalidateMode: AutovalidateMode.onUserInteraction,
          onChanged: (value) {
            widget.onEnter(value);
          },
          decoration: InputDecoration(
            prefixIcon: widget.prefixwidget,
            suffixIcon: widget.suffixWidget,
            hintText: widget.hintText,
            hintStyle: const TextStyle(fontSize: 14, color: clr.grey02),
            contentPadding: const EdgeInsets.symmetric(
              vertical: 0,
              horizontal: 15,
            ),
            enabledBorder: UiHelper.getInputBorder(2, borderColor: clr.grey01),
            focusedBorder: UiHelper.getInputBorder(2, borderColor: clr.grey01),
            errorBorder: UiHelper.getInputBorder(2, borderColor: clr.red),
            focusedErrorBorder: UiHelper.getInputBorder(2, borderColor: clr.red),
          ),
          keyboardType: TextInputType.text,
          validator: widget.validating,
        ),
      ],
    );
  }
}
