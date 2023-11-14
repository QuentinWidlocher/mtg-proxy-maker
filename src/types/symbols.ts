import zero from "../assets/images/card-symbols/0.svg";
import one from "../assets/images/card-symbols/1.svg";
import ten from "../assets/images/card-symbols/10.svg";
import hundred from "../assets/images/card-symbols/100.svg";
import million from "../assets/images/card-symbols/1000000.svg";
import eleven from "../assets/images/card-symbols/11.svg";
import twelve from "../assets/images/card-symbols/12.svg";
import thirteen from "../assets/images/card-symbols/13.svg";
import fourteen from "../assets/images/card-symbols/14.svg";
import fifteen from "../assets/images/card-symbols/15.svg";
import sixteen from "../assets/images/card-symbols/16.svg";
import seventeen from "../assets/images/card-symbols/17.svg";
import eighteen from "../assets/images/card-symbols/18.svg";
import nineteen from "../assets/images/card-symbols/19.svg";
import two from "../assets/images/card-symbols/2.svg";
import twenty from "../assets/images/card-symbols/20.svg";
import twoB from "../assets/images/card-symbols/2B.svg";
import twoG from "../assets/images/card-symbols/2G.svg";
import twoR from "../assets/images/card-symbols/2R.svg";
import twoU from "../assets/images/card-symbols/2U.svg";
import twoW from "../assets/images/card-symbols/2W.svg";
import three from "../assets/images/card-symbols/3.svg";
import four from "../assets/images/card-symbols/4.svg";
import five from "../assets/images/card-symbols/5.svg";
import six from "../assets/images/card-symbols/6.svg";
import seven from "../assets/images/card-symbols/7.svg";
import eight from "../assets/images/card-symbols/8.svg";
import nine from "../assets/images/card-symbols/9.svg";
import A from "../assets/images/card-symbols/A.svg";
import B from "../assets/images/card-symbols/B.svg";
import BG from "../assets/images/card-symbols/BG.svg";
import BP from "../assets/images/card-symbols/BP.svg";
import BR from "../assets/images/card-symbols/BR.svg";
import C from "../assets/images/card-symbols/C.svg";
import CHAOS from "../assets/images/card-symbols/CHAOS.svg";
import E from "../assets/images/card-symbols/E.svg";
import G from "../assets/images/card-symbols/G.svg";
import GP from "../assets/images/card-symbols/GP.svg";
import GU from "../assets/images/card-symbols/GU.svg";
import GW from "../assets/images/card-symbols/GW.svg";
import HALF from "../assets/images/card-symbols/HALF.svg";
import HR from "../assets/images/card-symbols/HR.svg";
import HW from "../assets/images/card-symbols/HW.svg";
import INFINITY from "../assets/images/card-symbols/INFINITY.svg";
import L from "../assets/images/card-symbols/L.svg";
import P from "../assets/images/card-symbols/P.svg";
import PB from "../assets/images/card-symbols/PB.svg";
import PW from "../assets/images/card-symbols/PW.svg";
import Q from "../assets/images/card-symbols/Q.svg";
import R from "../assets/images/card-symbols/R.svg";
import RG from "../assets/images/card-symbols/RG.svg";
import RP from "../assets/images/card-symbols/RP.svg";
import RW from "../assets/images/card-symbols/RW.svg";
import S from "../assets/images/card-symbols/S.svg";
import T from "../assets/images/card-symbols/T.svg";
import U from "../assets/images/card-symbols/U.svg";
import UB from "../assets/images/card-symbols/UB.svg";
import UP from "../assets/images/card-symbols/UP.svg";
import UR from "../assets/images/card-symbols/UR.svg";
import W from "../assets/images/card-symbols/W.svg";
import WB from "../assets/images/card-symbols/WB.svg";
import WP from "../assets/images/card-symbols/WP.svg";
import WU from "../assets/images/card-symbols/WU.svg";
import X from "../assets/images/card-symbols/X.svg";
import Y from "../assets/images/card-symbols/Y.svg";
import Z from "../assets/images/card-symbols/Z.svg";
import Action from "../assets/images/card-symbols/Action.svg";
import BonusAction from "../assets/images/card-symbols/BonusAction.svg";
import Reaction from "../assets/images/card-symbols/Reaction.svg";
import D4 from "../assets/images/card-symbols/D4.png";
import D6 from "../assets/images/card-symbols/D6.png";
import D8 from "../assets/images/card-symbols/D8.png";
import D10 from "../assets/images/card-symbols/D10.png";
import D12 from "../assets/images/card-symbols/D12.png";
import D20 from "../assets/images/card-symbols/D20.png";

export const symbols = {
  0: zero,
  1: one,
  2: two,
  3: three,
  4: four,
  5: five,
  6: six,
  7: seven,
  8: eight,
  9: nine,
  10: ten,
  11: eleven,
  12: twelve,
  13: thirteen,
  14: fourteen,
  15: fifteen,
  16: sixteen,
  17: seventeen,
  18: eighteen,
  19: nineteen,
  20: twenty,
  100: hundred,
  1000000: million,
  A,
  Action,
  B,
  BonusAction,
  BG,
  BP,
  C,
  CHAOS,
  E,
  GP,
  GU,
  GW,
  HALF,
  HR,
  HW,
  INFINITY,
  L,
  P,
  PB,
  PW,
  Q,
  R,
  RG,
  RP,
  RW,
  S,
  T,
  U,
  UB,
  UP,
  W,
  WB,
  WU,
  X,
  Y,
  Z,
  BR,
  G,
  UR,
  WP,
  Reaction,
  "2B": twoB,
  "2G": twoG,
  "2R": twoR,
  "2U": twoU,
  "2W": twoW,
  "D4": D4,
  "D6": D6,
  "D8": D8,
  "D10": D10,
  "D12": D12,
  "D20": D20,
} as const;

export type GameSymbol = keyof typeof symbols;
