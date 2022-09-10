/*
 * Copyright © 2022 By Geeks Empire.
 *
 * Created by Elias Fazel
 * Last modified 9/10/22, 7:17 AM
 *
 * Licensed Under MIT License.
 * https://opensource.org/licenses/MIT
 */

import 'package:blur/blur.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_remote_config/firebase_remote_config.dart';
import 'package:flutter/material.dart';
import 'package:flutter_html/flutter_html.dart';
import 'package:liquid_swipe/liquid_swipe.dart';
import 'package:sachiel/firebase_options.dart';
import 'package:sachiel/remote/remote_configurations.dart';
import 'package:sachiel/resources/colors_resources.dart';
import 'package:sachiel/resources/strings_resources.dart';
import 'package:sachiel/utils/data/numbers.dart';
import 'package:sachiel/utils/ui/display.dart';

void main() async {

  WidgetsBinding widgetsBinding = WidgetsFlutterBinding.ensureInitialized();

  var firebaseInitialized = await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );

  runApp(
      MaterialApp(
          home: IntroductionSlides()
      )
  );

}

class IntroductionSlides extends StatefulWidget {

  FirebaseRemoteConfig? firebaseRemoteConfig;

  IntroductionSlides({Key? key, firebaseRemoteConfig}) : super(key: key);

  @override
  State<IntroductionSlides> createState() => IntroductionSlidesState();

}
class IntroductionSlidesState extends State<IntroductionSlides> {

  LiquidController liquidController = LiquidController();

  Widget allContent = Container();

  @override
  void initState() {
    super.initState();

    if (widget.firebaseRemoteConfig == null) {

      retrieveRemoteConfigurations();

    } else {



    }

  }

  @override
  Widget build(BuildContext context) {

    return SafeArea(
        child: MaterialApp(
            debugShowCheckedModeBanner: false,
            title: StringsResources.applicationName(),
            color: ColorsResources.primaryColor,
            theme: ThemeData(
              fontFamily: 'Ubuntu',
              colorScheme: ColorScheme.fromSwatch().copyWith(secondary: ColorsResources.primaryColor),
              backgroundColor: ColorsResources.black,
              pageTransitionsTheme: const PageTransitionsTheme(builders: {
                TargetPlatform.android: ZoomPageTransitionsBuilder(),
                TargetPlatform.iOS: ZoomPageTransitionsBuilder(),
              }),
            ),
            home: Scaffold(
                backgroundColor: ColorsResources.black,
                body:Stack(
                  children: [

                    /* Start - Gradient Background - Dark */
                    Container(
                      decoration: const BoxDecoration(
                        borderRadius: BorderRadius.only(
                            topLeft: Radius.circular(17),
                            topRight: Radius.circular(17),
                            bottomLeft: Radius.circular(17),
                            bottomRight: Radius.circular(17)
                        ),
                        border: Border(
                            top: BorderSide(
                              color: ColorsResources.black,
                              width: 7,
                            ),
                            bottom: BorderSide(
                              color: ColorsResources.black,
                              width: 7,
                            ),
                            left: BorderSide(
                              color: ColorsResources.black,
                              width: 7,
                            ),
                            right: BorderSide(
                              color: ColorsResources.black,
                              width: 7,
                            )
                        ),
                        gradient: LinearGradient(
                            colors: [
                              ColorsResources.premiumDark,
                              ColorsResources.black,
                            ],
                            begin: FractionalOffset(0.0, 0.0),
                            end: FractionalOffset(1.0, 0.0),
                            stops: [0.0, 1.0],
                            transform: GradientRotation(-45),
                            tileMode: TileMode.clamp
                        ),
                      ),
                    ),
                    /* End - Gradient Background - Dark */

                    /* Start - Gradient Background - Golden */
                    Align(
                        alignment: Alignment.topRight,
                        child: Container(
                          decoration: BoxDecoration(
                              borderRadius: const BorderRadius.only(
                                  topLeft: Radius.circular(17),
                                  topRight: Radius.circular(17),
                                  bottomLeft: Radius.circular(17),
                                  bottomRight: Radius.circular(17)
                              ),
                              gradient: RadialGradient(
                                radius: 1.1,
                                colors: <Color> [
                                  ColorsResources.primaryColorLighter.withOpacity(0.51),
                                  Colors.transparent,
                                ],
                                center: const Alignment(0.79, -0.87),
                              )
                          ),
                          child: SizedBox(
                            height: calculatePercentage(79, displayHeight(context)),
                            width: calculatePercentage(79, displayWidth(context)),
                          ),
                        )
                    ),
                    /* End - Gradient Background - Golden */

                    allContent

                  ],
                )
            )
        )
    );
  }

  void retrieveRemoteConfigurations() {

    if (widget.firebaseRemoteConfig != null) {

      /* Start - Introduction Liquid Slide */
      setState(() {

        allContent = ClipRRect(
          borderRadius: BorderRadius.circular(17),
          child: LiquidSwipe(
            liquidController: liquidController,
            onPageChangeCallback: (position) {

            },
            currentUpdateTypeCallback: (updateType) {

            },
            fullTransitionValue: 777,
            enableSideReveal: true,
            enableLoop: true,
            ignoreUserGestureWhileAnimating: true,
            slideIconWidget: Padding(
              padding: const EdgeInsets.fromLTRB(0, 0, 7, 0),
              child: Icon(
                Icons.arrow_back_ios_rounded,
                size: 27,
                color: ColorsResources.light,
                shadows: [
                  Shadow(
                      color: ColorsResources.light.withOpacity(0.37),
                      blurRadius: 7,
                      offset: const Offset(3, 0)
                  )
                ],
              ),
            ),
            positionSlideIcon: 0.5,
            waveType: WaveType.liquidReveal,
            pages: [

              firstSlideIntroduction(),

              secondSlideIntroduction(),

              thirdSlideIntroduction(),

            ],
          ),
        );

      });
      /* End - Introduction Liquid Slide */

    } else {

      widget.firebaseRemoteConfig = FirebaseRemoteConfig.instance;

      widget.firebaseRemoteConfig?.fetchAndActivate().then((value) {

        setState(() {

          allContent = ClipRRect(
            borderRadius: BorderRadius.circular(17),
            child: LiquidSwipe(
              liquidController: liquidController,
              onPageChangeCallback: (position) {

              },
              currentUpdateTypeCallback: (updateType) {

              },
              fullTransitionValue: 777,
              enableSideReveal: true,
              enableLoop: true,
              ignoreUserGestureWhileAnimating: true,
              slideIconWidget: Padding(
                padding: const EdgeInsets.fromLTRB(0, 0, 7, 0),
                child: Icon(
                  Icons.arrow_back_ios_rounded,
                  size: 27,
                  color: ColorsResources.light,
                  shadows: [
                    Shadow(
                        color: ColorsResources.light.withOpacity(0.37),
                        blurRadius: 7,
                        offset: const Offset(3, 0)
                    )
                  ],
                ),
              ),
              positionSlideIcon: 0.5,
              waveType: WaveType.liquidReveal,
              pages: [

                firstSlideIntroduction(),

                secondSlideIntroduction(),

                thirdSlideIntroduction(),

              ],
            ),
          );

        });

      });

    }

  }

  Widget firstSlideIntroduction() {

    String htmlContent = ".<b>.</b><big>.</big>";

    if (widget.firebaseRemoteConfig != null) {

      htmlContent = widget.firebaseRemoteConfig!.getString(RemoteConfigurations.slideTwoContent);

    }

    return Container(
      color: ColorsResources.dark,
      child: Stack(
        children: [

          /* Start - Branding Transparent */
          const Align(
            alignment: Alignment.center,
            child: Opacity(
              opacity: 0.13,
              child: Image(
                image: AssetImage("logo.png"),
              ),
            ),
          ),
          /* End - Branding Transparent */

          /* Start - Browser */
          Padding(
            padding: const EdgeInsets.fromLTRB(13, 0, 73, 0),
            child: Align(
              alignment: Alignment.center,
              child: ClipRRect(
                  borderRadius: BorderRadius.circular(17),
                  child: Blur(
                    blur: 13,
                    blurColor: ColorsResources.white,
                    colorOpacity: 0.13,
                    overlay: Padding(
                      padding: const EdgeInsets.fromLTRB(7, 7, 7, 7),
                      child: Html(
                          data: htmlContent
                      ),
                    ),
                    child: SizedBox(
                      height: calculatePercentage(70, displayHeight(context)),
                      width: calculatePercentage(70, displayWidth(context)),
                    ),
                  )
              ),
            ),
          )
          /* End - Browser */

        ],
      )
    );
  }

  Widget secondSlideIntroduction() {

    String htmlContent = ".<b>.</b><big>.</big>";

    if (widget.firebaseRemoteConfig != null) {

      htmlContent = widget.firebaseRemoteConfig!.getString(RemoteConfigurations.slideOneContent);

    }

    return Container(
      color: ColorsResources.premiumDark,
        child: Stack(
          children: [

            /* Start - Branding Transparent */
            const Align(
              alignment: Alignment.center,
              child: Opacity(
                opacity: 0.13,
                child: Image(
                  image: AssetImage("logo.png"),
                ),
              ),
            ),
            /* End - Branding Transparent */

            /* Start - Browser */
            Padding(
              padding: const EdgeInsets.fromLTRB(13, 0, 73, 0),
              child: Align(
                alignment: Alignment.center,
                child: ClipRRect(
                    borderRadius: BorderRadius.circular(17),
                    child: Blur(
                      blur: 13,
                      blurColor: ColorsResources.white,
                      colorOpacity: 0.13,
                      overlay: Padding(
                        padding: const EdgeInsets.fromLTRB(7, 7, 7, 7),
                        child: Html(
                            data: htmlContent
                        ),
                      ),
                      child: SizedBox(
                        height: calculatePercentage(70, displayHeight(context)),
                        width: calculatePercentage(70, displayWidth(context)),
                      ),
                    )
                ),
              ),
            )
            /* End - Browser */

          ],
        )
    );
  }

  Widget thirdSlideIntroduction() {

    String htmlContent = ".<b>.</b><big>.</big>";

    if (widget.firebaseRemoteConfig != null) {

      htmlContent = widget.firebaseRemoteConfig!.getString(RemoteConfigurations.slideThreeContent);

    }

    return Container(
      color: ColorsResources.primaryColor,
        child: Stack(
          children: [

            /* Start - Branding Transparent */
            const Align(
              alignment: Alignment.center,
              child: Opacity(
                opacity: 0.13,
                child: Image(
                  image: AssetImage("logo.png"),
                ),
              ),
            ),
            /* End - Branding Transparent */

            /* Start - Browser */
            Padding(
              padding: const EdgeInsets.fromLTRB(13, 0, 73, 0),
              child: Align(
                alignment: Alignment.center,
                child: ClipRRect(
                    borderRadius: BorderRadius.circular(17),
                    child: Blur(
                      blur: 13,
                      blurColor: ColorsResources.white,
                      colorOpacity: 0.13,
                      overlay: Padding(
                        padding: const EdgeInsets.fromLTRB(7, 7, 7, 7),
                        child: Html(
                            data: htmlContent
                        ),
                      ),
                      child: SizedBox(
                        height: calculatePercentage(70, displayHeight(context)),
                        width: calculatePercentage(70, displayWidth(context)),
                      ),
                    )
                ),
              ),
            )
            /* End - Browser */

          ],
        )
    );
  }

}