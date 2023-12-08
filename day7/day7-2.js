const countCharacterOccurrences = (card, hand) => {
    // Create a regular expression to find 'card' in 'hand'
    // 'g' flag for global search and 'escape' special characters in card
    let regExp = new RegExp(card.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g');

    // Use match to find occurrences. If no match, return 0
    let matches = hand.match(regExp);
    return matches ? matches.length : 0;
}

const isFiveOfAKind = (hand) => hand.replace(new RegExp(hand[0], 'g'), '') == '';
const isFourOfAKind = (hand) => hand.replace(new RegExp(hand[0], 'g'), '').length == 1 || hand.replace(new RegExp(hand[1], 'g'), '').length == 1;
const isFullHouse = (hand) => {
    const h1 = hand.replace(new RegExp(hand[0], 'g'), '')
    const h2 = h1.replace(new RegExp(h1[0], 'g'), '')
    return h2.length == 0;
}
const isThreeOfAKind = (hand) => {
    // count the occurrences for each character; the total count should be 11 (3*3 for each of the characters that occur three times and twice 1 for the other two characters)
    let totalCount = 0;
    for (let i = 0; i < 5; i++) {
        totalCount += countCharacterOccurrences(hand[i], hand)
    }
    return totalCount == 11;
}
const isTwoPair = (hand) => {
    // count the occurrences for each character; the total count should be  9 (2*4 for each of the characters that occur twice and once 1 for the other character)
    let totalCount = 0;
    for (let i = 0; i < 5; i++) {
        totalCount += countCharacterOccurrences(hand[i], hand)
    }
    return totalCount == 9;
}

const isOnePair = (hand) => {
    // count the occurrences for each character; the total count should be  7 (2*2 for each of the characters that occur twice and three times 1 for the other characters)
    let totalCount = 0;
    for (let i = 0; i < 5; i++) {
        totalCount += countCharacterOccurrences(hand[i], hand)
    }
    return totalCount == 7;
}

const cardStrengthMap = { 'A': 14, 'K': 13, 'Q': 12, 'J': 0, 'T': 10, '9': 9, '8': 8, '7': 7, '6': 6, '5': 5, '4': 4, '3': 3, '2': 2 }

const compareHand = (handA, handB) => {
    let result = 0
    for (let i = 0; i < handA.length; i++) {
        const comparison = cardStrengthMap[handA[i]] - cardStrengthMap[handB[i]]
        if (comparison != 0) { result = comparison / Math.abs(comparison); break }
    }
    return result
}

const processJokers = (hand, nonJokerCards, maxStrengthFound) => {
    const jokerIndex = hand.indexOf('J') 
    let maxHandStrength = maxStrengthFound
    if (jokerIndex >= 0) { 
        for (let i=0;i<nonJokerCards.length;i++) {
          maxHandStrength = Math.max( maxHandStrength, 
                                      processJokers( hand.substring(0,jokerIndex)
                                         + nonJokerCards[i]
                                         + hand.substring(jokerIndex+1)
                                       , nonJokerCards
                                       , maxHandStrength
                                       )
                                    )
        }
    } else {
       return Math.max(handStrength(hand), maxHandStrength)
    }
    return maxHandStrength
}

const handStrength = (hand) =>  isFiveOfAKind(hand) ? 10 : isFourOfAKind(hand) ? 9 : isFullHouse(hand) ? 8 : isThreeOfAKind(hand) ? 7 : isTwoPair(hand) ? 6 : isOnePair(hand) ? 5 : 4


const produceResult = () => {
    const lines = inputDoc.split('\n');
    const hands = []
    for (const line of lines) {
        const handAndBid = line.split(' ');
        const hand = handAndBid[0];
        const bid = parseInt(handAndBid[1]);
        // calculate the highest strength we can achieve by replacing jokers with all other cards that occur in the hand
        const handStrength = (hand == 'JJJJJ'? 10 : processJokers(hand, hand.replace(/J/g,"") ,0))
        hands.push({ hand: hand, bid: bid, strength: handStrength })
    }


    hands.sort((a, b) => a.strength != b.strength ? a.strength - b.strength : compareHand(a.hand, b.hand));
    // Step 2: Sum 'bid' values
    let totalBid = hands.reduce((sum, hand, index) => sum + hand.bid * (index + 1), 0);
    console.log(`Total Bid =${totalBid}`)
}

const inputDoc2 = `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`

const inputDoc = `T33AA 613
J5JJ5 411
J4444 240
T5K98 463
7Q6K2 4
772T2 730
23228 608
T254A 212
TJ584 169
5T555 349
5A5A5 539
66K55 341
7TJK2 70
Q9999 763
555J7 359
A2Q22 607
699J6 922
QQQ66 110
K9KKK 225
Q646Q 96
AJ66A 51
6J234 615
QAAAQ 723
99992 453
77666 497
8TKQ7 325
88988 842
8724K 89
QJQ53 626
A5AKA 145
25TT2 267
22T69 414
63A7Q 941
69655 461
QT7T3 648
82929 121
424Q2 846
53935 224
633TJ 619
42494 85
39J35 661
9J449 596
TTATT 74
KK88K 219
99696 811
33347 916
6AJJA 716
24334 281
T3TTJ 472
T6TJK 952
32883 378
A9J5T 934
99888 103
688QQ 836
45J97 152
KQJK5 80
26QKK 499
3333J 138
22JQ8 789
T66TT 475
9JQA2 511
356A8 462
Q8AQQ 148
6AT95 696
3752Q 58
5K88T 270
TAAA5 793
J7479 647
444QQ 853
83922 584
34T72 114
8T23A 546
999J6 269
895K9 203
J58T8 831
8AK44 875
A3333 531
29K67 604
J9K97 680
A7AAA 286
8927T 717
7KKK8 492
98839 64
63K83 444
QJ2QQ 882
J828J 769
3A77A 217
T9228 266
73A44 250
2KK7Q 39
44KA5 708
K8K64 535
3AA9A 981
KT6TK 825
4T6TJ 503
632TK 948
QT869 813
24249 348
A3Q8A 519
T6385 291
935Q4 543
88585 796
49777 244
Q3J33 971
T5J44 868
99797 319
88J2K 627
224JT 571
J45A4 216
76847 130
4922A 263
66Q49 991
22J32 823
48675 277
AT9QT 153
86848 232
QQK6J 669
K22JK 662
28TKJ 737
QJ88Q 745
39338 177
TQ5Q4 624
4J549 752
AQJT3 228
736Q6 392
22A3A 656
7KK27 724
4K444 826
85888 347
7746J 639
67777 822
K9989 671
5T267 659
KKTKK 815
92279 541
47422 82
9T3TJ 26
TTK7Q 13
Q9J9Q 625
T495Q 798
794T6 963
99TT9 508
27433 32
29282 260
28Q82 521
95449 756
28666 191
A84QT 616
292Q2 282
K4JQ5 442
T3883 866
66TKT 918
44KK7 892
T5T9A 122
77J79 635
447J7 273
8448T 598
29JTT 5
33KJT 7
52454 634
99A9A 527
228TQ 747
3J3AT 715
QQ6QQ 421
65KK3 750
9KK4J 970
4K769 201
2255K 183
95598 564
7797Q 94
84442 706
T28AA 832
TT949 498
8669J 218
5262A 454
3829J 593
2J74J 47
76K95 940
99899 695
K252K 298
AT6K3 173
T4A22 409
85558 555
5TJJT 930
Q79KA 477
J83JQ 185
57J87 630
JJJ44 643
JAAAA 787
6J344 684
A7J7K 415
TKATT 242
K7JA6 873
22999 170
T73K6 664
696T2 699
9KK9K 707
J55J9 645
5Q555 691
9JJ95 81
A75J2 621
KK6K4 274
92T92 436
66555 614
47J69 924
58A85 673
6666K 709
24A8J 220
3T779 481
AK478 479
9QTT9 120
95Q78 227
67469 71
KK9KJ 268
62599 72
73733 147
KJQQQ 761
33335 294
355T5 777
93T62 550
5777Q 526
JAJK7 25
AAA8A 510
9JTT4 457
A9AKA 711
K333K 426
QQ22Q 222
8J7K3 986
KK8TA 894
6TJQ6 722
A44KA 418
794TA 272
JT5J6 814
T5328 686
AA2AA 28
K39A3 160
T9A67 382
JJJJJ 917
2424J 666
745AA 312
4K56K 383
3K25A 712
88QQ5 76
927QT 570
7K249 288
5565J 252
4QQ4T 651
QQ666 435
2Q262 967
K59AQ 175
K2K26 402
89J64 188
8K866 379
A69J5 331
77474 504
AK4A8 352
T5TKQ 563
4Q23K 578
226J2 966
Q93A5 590
28T25 505
6A49T 512
TTT8T 513
24342 500
82882 48
37JA9 432
596J8 259
93993 207
6A636 629
TQKKT 938
66786 433
96976 243
A6J33 88
TATA4 12
9A999 365
5623J 292
6K6KK 158
6T665 441
3Q57Q 3
64644 898
68888 223
J8889 14
T4J6J 360
J7773 357
QA4AQ 601
83A62 812
QJ7J7 434
QTK86 705
5T885 896
A9575 261
A95AT 164
AJJ68 583
KQJ2Q 742
7JQ79 518
T27JJ 317
QTTTT 586
5677Q 146
42442 797
4AT7T 490
88JTT 59
77T77 253
88JAA 37
3T633 221
K28KK 395
2J22K 1000
66T54 416
K2KKK 264
248Q5 989
88A87 390
555JJ 890
22662 556
54J54 559
22264 179
TA253 694
TTT9T 27
3A9K2 861
Q87QJ 600
A7K4J 190
99J99 239
5JA64 725
28TAQ 530
69Q6Q 314
46443 620
9Q993 256
J7K47 482
26J66 108
J5855 978
4QJQK 720
44449 790
T5JTT 912
773TT 862
9J6K8 340
K77QQ 744
T94J4 878
J2K9T 305
TTT22 692
4J877 284
QJQQQ 487
3Q39Q 641
22KKK 494
8JQK5 591
J99J2 937
K3845 19
55755 278
82AT8 721
J6666 323
K2K6K 77
T3QJ8 358
KQTKK 837
222QQ 968
263Q3 655
99222 582
555KQ 877
TJTJ4 663
3KQ4T 985
268Q4 214
AAJJA 872
K444K 9
89J8Q 753
22488 144
Q82J8 734
54545 20
99JQJ 886
88TTA 129
22525 287
52A99 182
8654T 575
T9572 731
AQAJQ 611
8AT45 420
99934 393
J5KJK 580
43A4J 529
48465 450
36AA6 998
KT2JQ 927
65Q78 488
89T5A 33
72AA7 623
7777J 406
JQ999 16
42TK6 729
Q2QQQ 949
8J3JK 560
32323 438
6687Q 53
7A7A7 166
8Q5Q5 828
899QK 867
JK4A5 87
3A33Q 788
4Q734 821
33JJJ 746
7TAAA 118
AA44J 538
5JJ8T 931
JTQ6T 155
J5555 493
2AA5T 301
72732 78
KTJ7T 255
KAAAJ 906
63QQ7 443
T2653 2
3Q334 728
T4J67 205
7QT86 926
4J4K4 495
A7227 68
69984 786
2J95A 757
94AAQ 380
T2J5A 198
J5995 22
54444 91
K3QA5 840
4TT44 396
88883 194
77722 136
9A9T6 502
K54KK 176
73878 549
87JA5 758
KK555 38
34A44 689
436K9 123
9A286 391
66A56 215
9QQK9 63
99392 887
99994 817
A9229 125
446A3 921
QAAA9 113
222TT 295
66227 262
QTTAA 804
362A4 417
AQAAA 976
5535J 809
8858T 69
745QA 486
62626 928
92Q2T 558
55889 445
QJ857 465
QQ99Q 925
69657 576
33KKK 478
33QKQ 448
744AA 300
36363 322
2TTJT 785
QQ8QQ 776
AQ2K7 740
J666J 425
7463Q 79
TQQQQ 933
6898J 710
7Q629 36
55Q5J 141
3A7AJ 302
2K229 458
JJ999 929
2J222 368
55577 167
5A8J2 960
74434 806
3JQ3Q 904
44884 848
AATAK 864
8833Q 67
788J8 738
49443 741
TJTTJ 603
9999K 11
43JAA 399
Q8Q98 953
996T9 779
J92AA 171
4A339 439
7QJ67 102
5T52T 446
9T555 735
37582 162
9949T 714
62444 124
KTTKT 506
Q7TK4 473
4A4J4 983
K8QT5 587
9Q299 572
J252J 683
23T4Q 181
Q96AT 820
8J47J 841
TA9TA 318
A58TT 654
5555K 895
24372 154
TTTJT 977
88285 805
2T8J4 367
A7AA7 818
TT44J 964
Q799Q 573
KJQ8Q 829
2JT23 592
9A9AJ 585
J799T 883
AATTA 568
39395 289
A8557 553
TKTTT 115
5AA35 132
T67Q6 507
KJ773 844
J39AK 371
444TJ 397
7548K 958
6676J 192
22822 275
4J343 638
93JAQ 525
TA34K 229
T44KK 408
2J229 381
49JJJ 657
622K2 364
66654 111
KKK4T 394
35885 551
J49J9 363
99567 542
K49JA 957
55335 713
K5577 431
69987 66
J9KAK 557
297A8 994
799AJ 299
K3647 276
33KQ4 988
8J338 332
5368J 469
66AK4 168
8T688 135
KK698 336
7TJ77 987
TAT43 748
6K466 703
TQ567 845
94998 55
32363 233
K2J28 835
383J3 99
7629A 65
4447A 178
TJTKK 134
5TTQ5 324
7KQK7 681
87877 196
82282 419
23TTJ 165
A888A 850
7945T 474
6K339 231
A5A2K 577
97A39 491
766JA 139
AK73A 951
3AA99 794
8JQ47 484
4QQ47 956
8ATJA 857
9KK8Q 57
6K6K2 675
Q3QKQ 515
93J8T 483
66J46 489
7QQQ7 765
T2T45 6
JA2AJ 992
434K9 356
K85TK 610
QK543 485
23232 204
222Q2 697
668T8 8
TTJAT 236
5KKKK 852
666QJ 876
84544 579
9T43Q 93
53424 561
7KA42 471
5J3A5 246
QKK6Q 567
3T33J 362
5967J 827
3333Q 801
97832 290
89299 802
ATJQ5 727
22924 954
8J888 676
32396 90
3533K 384
977T7 910
TQ4TT 678
84K44 310
T8T67 116
A72K5 839
TTJTK 100
A8A6A 133
A3384 751
J77J7 733
A4TJ4 60
53974 640
749TK 501
TT333 516
6TQQK 387
T4QT4 112
747J7 863
J3868 97
93K33 995
8K888 468
72777 754
8QQ8Q 803
48T59 107
T9TQQ 451
33JJ3 900
TT6TT 783
3JA73 375
59235 644
3322Q 781
T7TTT 843
KKK68 372
QAQ5T 52
7K2KK 528
J2A82 106
A5J7A 385
758Q7 524
62767 333
8JAQ2 901
674AQ 186
A9T34 10
3K333 562
39433 935
QQQQ5 633
38Q55 234
555JK 337
KKKQ9 407
QTTQQ 388
66AQ7 701
25AA5 338
QA397 29
44424 979
A4JQJ 685
Q8888 30
333J6 328
KKKK3 913
33897 343
AATA8 606
845QJ 589
93733 98
4J338 536
J8488 313
33T33 49
7TKTK 280
QAQQQ 374
TT7T7 235
944T9 335
4KAKA 386
A8A48 959
67647 1
66466 456
2JT77 35
Q4QQQ 547
3J8AA 800
T5444 354
7732J 514
KKTAA 311
8JJJA 792
75KKK 427
JT2K3 137
K354A 540
T5TTT 424
7Q594 303
J6J6J 642
65384 914
5A8AA 189
82249 984
8Q76K 140
875KJ 565
QJA23 40
QQ82Q 946
94T28 258
7222T 636
6A9K2 127
J7725 452
56656 351
99969 447
K3Q63 92
QJJ58 370
24368 854
JJ9K9 612
8J3J8 833
88QQ8 321
JT479 736
522J6 889
Q57JT 202
A5KJT 83
TTTAA 285
2A2AA 326
TQT4A 149
93333 353
KKKJK 693
828J8 62
95544 860
2JJJ9 480
33666 574
KQ293 915
888T8 31
762AJ 637
43483 599
46544 377
8A588 43
TT35T 668
59795 226
2KKKJ 509
QT492 865
J3634 945
88877 279
49J26 423
Q838T 307
A73A3 780
J3J36 955
45655 771
752A4 888
6A4AA 84
62Q5J 665
A222A 858
QQQQ7 773
JJJJ8 943
5AAAA 520
28696 389
J9939 15
57385 618
2T4J9 874
99K9K 199
39749 455
94273 719
88358 849
74TTQ 17
JK6AQ 117
K7525 75
3Q2A6 760
2J969 460
55QJT 464
T2222 544
9898T 595
J6866 982
QJQ54 467
66996 962
2552Q 532
66QQJ 939
QK477 41
838J8 755
5969Q 622
32555 739
5TQ79 602
63979 871
J3AA3 808
TTJJJ 791
88284 923
666T6 554
4J4AQ 193
QT32K 672
KTA96 403
TT4TT 251
5AA86 942
7373J 950
45QT8 581
99Q7J 413
2662K 838
77J55 880
Q8393 157
KAAAA 936
T7QKK 329
JKQAK 412
22242 45
7T5T8 105
5A69K 881
TJAAA 316
4A36A 911
5JJ66 265
48884 766
TA385 605
7A72J 762
43A3A 652
24K4Q 195
67K5T 632
55TT5 919
T686T 617
83667 306
T6TA6 932
QJ746 430
29TQK 772
63J38 18
QT2J5 449
79737 893
79J8J 104
Q762J 180
7J433 996
9K6K6 34
K972Q 552
57877 702
4AQJA 851
23337 768
TTJ67 376
66686 320
KA7KA 847
444AA 210
58226 346
AJK22 649
6AJJ6 631
TJJT9 698
T583K 42
2Q2JQ 334
99KK8 24
QQQJJ 770
J9599 879
K6287 646
AA858 891
3TT3T 400
5K982 537
5764T 315
A8828 73
TQ8AT 980
83J27 197
778KA 594
335T6 257
3Q925 670
5KJKK 237
8TKJ4 660
A8AA3 679
8Q889 131
726T2 174
QQ8T8 682
36436 126
5J329 21
J8A9J 920
JQA95 855
9Q263 653
K2555 297
65J33 990
2A49T 163
AQTK2 903
TK7TT 366
6A2J4 870
55534 704
66469 588
5K5KK 172
6AT3A 293
A5AA9 440
685Q3 885
T5A97 767
K6258 466
4Q28A 726
7T555 404
7KKKK 345
JJJ88 330
222KK 496
ATJQJ 690
QT563 308
Q48KQ 206
TTJT8 209
TTT3T 522
82878 405
JA37T 628
3T878 159
77Q96 597
K9488 245
J8448 972
69743 254
J72Q5 369
69666 749
2KTAA 373
JK556 816
43833 230
42242 743
A28T5 775
K585J 361
Q4433 119
333J4 344
3A7T9 961
JT236 249
84899 807
TT99K 830
AAJ2A 50
36333 429
9K9KA 869
J2777 774
4455T 150
3KQ87 718
AAKKJ 247
94K94 271
J2759 46
32495 899
4T68Q 156
6JA66 428
QQ464 213
9T92J 248
K7QA8 459
KJJKK 523
22JJ2 534
J96Q6 884
4K4KJ 327
66777 109
K6336 908
2Q2TT 200
98494 907
74547 401
959J6 545
444T4 947
32222 56
3K66K 834
AKAAK 859
3Q3QQ 688
Q4Q4Q 759
JJ667 974
TAQTJ 969
97474 86
87K49 142
J6T77 241
T99J6 677
67666 810
J9K38 784
24JJ4 410
A73T6 569
77377 856
74784 973
496JK 339
2T7KQ 184
Q52Q8 905
47AA3 161
836TK 476
KT2TT 517
77QK7 309
4344J 208
45J55 824
57757 355
J22J3 609
9AJA7 658
293T9 993
66499 674
7Q777 650
TA4J3 296
QQKQQ 304
48944 799
25TKJ 342
T4TT4 795
88TT8 128
8A787 187
K9KK6 44
64A48 965
K84KJ 143
78A5T 548
66636 23
Q737Q 470
83A2J 211
3Q8K8 902
T655T 54
54745 398
QA869 422
893AQ 909
K66J6 819
99J86 997
99A9J 95
44237 566
3J2T3 975
J5223 732
97J7J 778
67QQ6 350
7444Q 944
69Q4A 764
5TT8T 533
52242 999
K5KJ5 687
JJ87K 667
TTT2T 283
QKKKK 437
J9555 151
53335 238
55554 700
7A6TQ 101
57AJQ 897
83485 782
K7773 61`

produceResult()