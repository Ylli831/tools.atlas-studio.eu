"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import ToolLayout from "@/components/ToolLayout";

interface EmojiCategory {
  name: string;
  emojis: string[];
}

const EMOJI_DATA: EmojiCategory[] = [
  {
    name: "Smileys",
    emojis: [
      "\u{1F600}", "\u{1F603}", "\u{1F604}", "\u{1F601}", "\u{1F606}", "\u{1F605}",
      "\u{1F602}", "\u{1F923}", "\u{1F60A}", "\u{1F607}", "\u{1F642}", "\u{1F643}",
      "\u{1F609}", "\u{1F60C}", "\u{1F60D}", "\u{1F970}", "\u{1F618}", "\u{1F617}",
      "\u{1F619}", "\u{1F61A}", "\u{1F60B}", "\u{1F61B}", "\u{1F61C}", "\u{1F92A}",
      "\u{1F61D}", "\u{1F911}", "\u{1F917}", "\u{1F92D}", "\u{1F92B}", "\u{1F914}",
      "\u{1F910}", "\u{1F928}", "\u{1F610}", "\u{1F611}", "\u{1F636}", "\u{1F60F}",
      "\u{1F612}", "\u{1F644}", "\u{1F62C}", "\u{1F925}", "\u{1F60E}", "\u{1F913}",
      "\u{1F9D0}", "\u{1F615}", "\u{1F61F}", "\u{1F641}", "\u{2639}\u{FE0F}", "\u{1F62E}",
      "\u{1F62F}", "\u{1F632}", "\u{1F633}", "\u{1F97A}", "\u{1F626}", "\u{1F627}",
      "\u{1F628}", "\u{1F630}", "\u{1F625}", "\u{1F622}", "\u{1F62D}", "\u{1F631}",
      "\u{1F616}", "\u{1F623}", "\u{1F61E}", "\u{1F613}", "\u{1F629}", "\u{1F62A}",
      "\u{1F924}", "\u{1F634}", "\u{1F637}", "\u{1F912}", "\u{1F915}", "\u{1F922}",
      "\u{1F92E}", "\u{1F927}", "\u{1F975}", "\u{1F976}", "\u{1F974}", "\u{1F635}",
    ],
  },
  {
    name: "People",
    emojis: [
      "\u{1F44B}", "\u{1F91A}", "\u{1F590}\u{FE0F}", "\u{270B}", "\u{1F596}",
      "\u{1F44C}", "\u{1F90C}", "\u{270C}\u{FE0F}", "\u{1F91E}", "\u{1F91F}",
      "\u{1F918}", "\u{1F919}", "\u{1F448}", "\u{1F449}", "\u{1F446}", "\u{1F595}",
      "\u{1F447}", "\u{261D}\u{FE0F}", "\u{1F44D}", "\u{1F44E}", "\u{270A}",
      "\u{1F44A}", "\u{1F91B}", "\u{1F91C}", "\u{1F44F}", "\u{1F64C}", "\u{1F450}",
      "\u{1F932}", "\u{1F91D}", "\u{1F64F}", "\u{270D}\u{FE0F}", "\u{1F485}",
      "\u{1F933}", "\u{1F4AA}", "\u{1F9BE}", "\u{1F9BF}", "\u{1F9B5}", "\u{1F9B6}",
      "\u{1F442}", "\u{1F9BB}", "\u{1F443}", "\u{1F9E0}", "\u{1FAC0}", "\u{1FAC1}",
      "\u{1F9B7}", "\u{1F9B4}", "\u{1F440}", "\u{1F441}\u{FE0F}", "\u{1F445}",
      "\u{1F444}", "\u{1F476}", "\u{1F9D2}", "\u{1F466}", "\u{1F467}", "\u{1F9D1}",
      "\u{1F471}", "\u{1F468}", "\u{1F9D4}", "\u{1F469}", "\u{1F9D3}", "\u{1F474}",
      "\u{1F475}", "\u{1F64D}", "\u{1F64E}", "\u{1F645}", "\u{1F646}", "\u{1F481}",
    ],
  },
  {
    name: "Animals",
    emojis: [
      "\u{1F435}", "\u{1F412}", "\u{1F98D}", "\u{1F9A7}", "\u{1F436}", "\u{1F415}",
      "\u{1F9AE}", "\u{1F429}", "\u{1F43A}", "\u{1F98A}", "\u{1F99D}", "\u{1F431}",
      "\u{1F408}", "\u{1F981}", "\u{1F42F}", "\u{1F405}", "\u{1F406}", "\u{1F434}",
      "\u{1F40E}", "\u{1F984}", "\u{1F993}", "\u{1F98C}", "\u{1F9AC}", "\u{1F42E}",
      "\u{1F402}", "\u{1F403}", "\u{1F404}", "\u{1F437}", "\u{1F416}", "\u{1F417}",
      "\u{1F43D}", "\u{1F40F}", "\u{1F411}", "\u{1F410}", "\u{1F42A}", "\u{1F42B}",
      "\u{1F999}", "\u{1F992}", "\u{1F418}", "\u{1F9A3}", "\u{1F98F}", "\u{1F99B}",
      "\u{1F42D}", "\u{1F401}", "\u{1F400}", "\u{1F439}", "\u{1F430}", "\u{1F407}",
      "\u{1F43F}\u{FE0F}", "\u{1F9AB}", "\u{1F994}", "\u{1F987}", "\u{1F43B}",
      "\u{1F428}", "\u{1F43C}", "\u{1F9A5}", "\u{1F9A6}", "\u{1F9A8}", "\u{1F998}",
      "\u{1F9A1}", "\u{1F43E}", "\u{1F983}", "\u{1F414}", "\u{1F413}", "\u{1F423}",
      "\u{1F424}", "\u{1F425}", "\u{1F426}", "\u{1F427}", "\u{1F54A}\u{FE0F}",
      "\u{1F985}", "\u{1F986}", "\u{1F9A2}", "\u{1F989}", "\u{1F9A4}", "\u{1FAB6}",
      "\u{1F9A9}", "\u{1F99A}", "\u{1F99C}", "\u{1F438}", "\u{1F40A}", "\u{1F422}",
      "\u{1F98E}", "\u{1F40D}", "\u{1F432}", "\u{1F409}", "\u{1F995}", "\u{1F996}",
      "\u{1F433}", "\u{1F40B}", "\u{1F42C}", "\u{1F9AD}", "\u{1F41F}", "\u{1F420}",
      "\u{1F421}", "\u{1F988}", "\u{1F419}", "\u{1F41A}", "\u{1F40C}", "\u{1F98B}",
      "\u{1F41B}", "\u{1F41C}", "\u{1F41D}", "\u{1FAB2}", "\u{1F41E}", "\u{1F997}",
    ],
  },
  {
    name: "Food",
    emojis: [
      "\u{1F347}", "\u{1F348}", "\u{1F349}", "\u{1F34A}", "\u{1F34B}", "\u{1F34C}",
      "\u{1F34D}", "\u{1F96D}", "\u{1F34E}", "\u{1F34F}", "\u{1F350}", "\u{1F351}",
      "\u{1F352}", "\u{1F353}", "\u{1FAD0}", "\u{1F95D}", "\u{1F345}", "\u{1FAD2}",
      "\u{1F965}", "\u{1F951}", "\u{1F346}", "\u{1F954}", "\u{1F955}", "\u{1F33D}",
      "\u{1F336}\u{FE0F}", "\u{1FAD1}", "\u{1F952}", "\u{1F96C}", "\u{1F966}",
      "\u{1F9C4}", "\u{1F9C5}", "\u{1F344}", "\u{1F95C}", "\u{1FAD8}", "\u{1F330}",
      "\u{1F35E}", "\u{1F950}", "\u{1F956}", "\u{1FAD3}", "\u{1F968}", "\u{1F96F}",
      "\u{1F95E}", "\u{1F9C7}", "\u{1F9C0}", "\u{1F356}", "\u{1F357}", "\u{1F969}",
      "\u{1F953}", "\u{1F354}", "\u{1F35F}", "\u{1F355}", "\u{1F32D}", "\u{1F96A}",
      "\u{1F32E}", "\u{1F32F}", "\u{1FAD4}", "\u{1F959}", "\u{1F9C6}", "\u{1F95A}",
      "\u{1F373}", "\u{1F958}", "\u{1F372}", "\u{1FAD5}", "\u{1F963}", "\u{1F957}",
      "\u{1F37F}", "\u{1F9C8}", "\u{1F9C2}", "\u{1F96B}", "\u{1F371}", "\u{1F358}",
      "\u{1F359}", "\u{1F35A}", "\u{1F35B}", "\u{1F35C}", "\u{1F35D}", "\u{1F360}",
      "\u{1F362}", "\u{1F363}", "\u{1F364}", "\u{1F365}", "\u{1F96E}", "\u{1F361}",
      "\u{1F95F}", "\u{1F960}", "\u{1F961}", "\u{1F980}", "\u{1F99E}", "\u{1F990}",
      "\u{1F991}", "\u{1F9AA}", "\u{1F366}", "\u{1F367}", "\u{1F368}", "\u{1F369}",
      "\u{1F36A}", "\u{1F382}", "\u{1F370}", "\u{1F9C1}", "\u{1F967}", "\u{1F36B}",
      "\u{1F36C}", "\u{1F36D}", "\u{1F36E}", "\u{1F36F}", "\u{1F37C}", "\u{1F95B}",
      "\u{2615}", "\u{1FAD6}", "\u{1F375}", "\u{1F376}", "\u{1F37E}", "\u{1F377}",
      "\u{1F378}", "\u{1F379}", "\u{1F37A}", "\u{1F37B}", "\u{1F942}", "\u{1F943}",
    ],
  },
  {
    name: "Travel",
    emojis: [
      "\u{1F30D}", "\u{1F30E}", "\u{1F30F}", "\u{1F310}", "\u{1F5FA}\u{FE0F}",
      "\u{1F9ED}", "\u{1F3D4}\u{FE0F}", "\u{26F0}\u{FE0F}", "\u{1F30B}", "\u{1F5FB}",
      "\u{1F3D5}\u{FE0F}", "\u{1F3D6}\u{FE0F}", "\u{1F3DC}\u{FE0F}", "\u{1F3DD}\u{FE0F}",
      "\u{1F3DE}\u{FE0F}", "\u{1F3DF}\u{FE0F}", "\u{1F3DB}\u{FE0F}", "\u{1F3D7}\u{FE0F}",
      "\u{1F9F1}", "\u{1FAA8}", "\u{1F3D8}\u{FE0F}", "\u{1F3DA}\u{FE0F}", "\u{1F3E0}",
      "\u{1F3E1}", "\u{1F3E2}", "\u{1F3E3}", "\u{1F3E4}", "\u{1F3E5}", "\u{1F3E6}",
      "\u{1F3E8}", "\u{1F3E9}", "\u{1F3EA}", "\u{1F3EB}", "\u{1F3EC}", "\u{1F3ED}",
      "\u{1F3EF}", "\u{1F3F0}", "\u{1F492}", "\u{1F5FC}", "\u{1F5FD}", "\u{26EA}",
      "\u{1F54C}", "\u{1F6D5}", "\u{1F54D}", "\u{26E9}\u{FE0F}", "\u{1F54B}",
      "\u{26F2}", "\u{26FA}", "\u{1F301}", "\u{1F303}", "\u{1F3D9}\u{FE0F}",
      "\u{1F304}", "\u{1F305}", "\u{1F306}", "\u{1F307}", "\u{1F309}", "\u{1F6E3}\u{FE0F}",
      "\u{1F6E4}\u{FE0F}", "\u{1F688}", "\u{1F682}", "\u{1F683}", "\u{1F684}",
      "\u{1F685}", "\u{1F686}", "\u{1F687}", "\u{1F68D}", "\u{1F68E}", "\u{1F690}",
      "\u{1F691}", "\u{1F692}", "\u{1F693}", "\u{1F694}", "\u{1F695}", "\u{1F696}",
      "\u{1F697}", "\u{1F698}", "\u{1F699}", "\u{1F6FB}", "\u{1F69A}", "\u{1F69B}",
      "\u{1F69C}", "\u{1F3CE}\u{FE0F}", "\u{1F3CD}\u{FE0F}", "\u{1F6F5}", "\u{1F6B2}",
      "\u{1F6F4}", "\u{1F6F9}", "\u{1F6FC}", "\u{2708}\u{FE0F}", "\u{1F6A2}",
      "\u{26F5}", "\u{1F6A4}", "\u{1F6F3}\u{FE0F}", "\u{1F680}", "\u{1F6F8}",
    ],
  },
  {
    name: "Activities",
    emojis: [
      "\u{26BD}", "\u{1F3C0}", "\u{1F3C8}", "\u{26BE}", "\u{1F94E}", "\u{1F3BE}",
      "\u{1F3D0}", "\u{1F3C9}", "\u{1F94F}", "\u{1FA83}", "\u{1F3B1}", "\u{1FA80}",
      "\u{1F3D3}", "\u{1F3F8}", "\u{1F3D2}", "\u{1F3D1}", "\u{1F94D}", "\u{1F3CF}",
      "\u{1FA03}", "\u{26F3}", "\u{1FA81}", "\u{1F3F9}", "\u{1F3A3}", "\u{1F93F}",
      "\u{1F94A}", "\u{1F94B}", "\u{1F945}", "\u{26F8}\u{FE0F}", "\u{1F3BF}",
      "\u{1F6F7}", "\u{1F3AF}", "\u{1FA80}", "\u{1F3AE}", "\u{1F579}\u{FE0F}",
      "\u{1F3B0}", "\u{1F3B2}", "\u{1F9E9}", "\u{1F3AD}", "\u{1F3A8}", "\u{1F3B5}",
      "\u{1F3B6}", "\u{1F3A4}", "\u{1F3A7}", "\u{1F3B7}", "\u{1FA97}", "\u{1F3B8}",
      "\u{1F3B9}", "\u{1F3BA}", "\u{1F3BB}", "\u{1FA95}", "\u{1F941}", "\u{1FA98}",
      "\u{1F3AC}", "\u{1F3AA}",
    ],
  },
  {
    name: "Objects",
    emojis: [
      "\u{231A}", "\u{1F4F1}", "\u{1F4F2}", "\u{1F4BB}", "\u{2328}\u{FE0F}",
      "\u{1F5A5}\u{FE0F}", "\u{1F5A8}\u{FE0F}", "\u{1F5B1}\u{FE0F}", "\u{1F5B2}\u{FE0F}",
      "\u{1F579}\u{FE0F}", "\u{1F4BD}", "\u{1F4BE}", "\u{1F4BF}", "\u{1F4C0}",
      "\u{1F4FC}", "\u{1F4F7}", "\u{1F4F8}", "\u{1F4F9}", "\u{1F3A5}", "\u{1F4FD}\u{FE0F}",
      "\u{1F4FA}", "\u{1F4FB}", "\u{1F4DE}", "\u{260E}\u{FE0F}", "\u{1F4DF}",
      "\u{1F50B}", "\u{1FAAB}", "\u{1F50C}", "\u{1F4A1}", "\u{1F526}", "\u{1F56F}\u{FE0F}",
      "\u{1F4D4}", "\u{1F4D5}", "\u{1F4D6}", "\u{1F4D7}", "\u{1F4D8}", "\u{1F4D9}",
      "\u{1F4DA}", "\u{1F4D3}", "\u{1F4D2}", "\u{1F4C3}", "\u{1F4DC}", "\u{1F4C4}",
      "\u{1F4F0}", "\u{1F5DE}\u{FE0F}", "\u{1F4D1}", "\u{1F516}", "\u{1F3F7}\u{FE0F}",
      "\u{1F4B0}", "\u{1FAA9}", "\u{1F4B4}", "\u{1F4B5}", "\u{1F4B6}", "\u{1F4B7}",
      "\u{1F4B8}", "\u{1F4B3}", "\u{1F9FE}", "\u{1F4B9}", "\u{2709}\u{FE0F}",
      "\u{1F4E7}", "\u{1F4E8}", "\u{1F4E9}", "\u{1F4E4}", "\u{1F4E5}", "\u{1F4E6}",
      "\u{1F4EB}", "\u{1F4EA}", "\u{1F4EC}", "\u{1F4ED}", "\u{1F4EE}", "\u{1F5F3}\u{FE0F}",
      "\u{270F}\u{FE0F}", "\u{2712}\u{FE0F}", "\u{1F58B}\u{FE0F}", "\u{1F58A}\u{FE0F}",
      "\u{1F58C}\u{FE0F}", "\u{1F58D}\u{FE0F}", "\u{1F4DD}", "\u{1F4BC}", "\u{1F4C1}",
      "\u{1F4C2}", "\u{1F5C2}\u{FE0F}", "\u{1F4C5}", "\u{1F4C6}", "\u{1F5D2}\u{FE0F}",
      "\u{1F5D3}\u{FE0F}", "\u{1F4CB}", "\u{1F4CC}", "\u{1F4CD}", "\u{1F4CE}",
      "\u{1F587}\u{FE0F}", "\u{1F4CF}", "\u{1F4D0}", "\u{2702}\u{FE0F}", "\u{1F5C3}\u{FE0F}",
      "\u{1F5C4}\u{FE0F}", "\u{1F5D1}\u{FE0F}", "\u{1F512}", "\u{1F513}", "\u{1F50F}",
      "\u{1F510}", "\u{1F511}", "\u{1F5DD}\u{FE0F}", "\u{1F528}", "\u{1FA93}",
      "\u{26CF}\u{FE0F}", "\u{2692}\u{FE0F}", "\u{1F6E0}\u{FE0F}", "\u{1F5E1}\u{FE0F}",
      "\u{2694}\u{FE0F}", "\u{1F52B}", "\u{1FA83}", "\u{1F6E1}\u{FE0F}", "\u{1F527}",
      "\u{1FA9B}", "\u{1F529}", "\u{2699}\u{FE0F}", "\u{1F5DC}\u{FE0F}", "\u{2696}\u{FE0F}",
    ],
  },
  {
    name: "Symbols",
    emojis: [
      "\u{2764}\u{FE0F}", "\u{1F9E1}", "\u{1F49B}", "\u{1F49A}", "\u{1F499}",
      "\u{1F49C}", "\u{1F5A4}", "\u{1F90E}", "\u{1F90D}", "\u{1F494}", "\u{2763}\u{FE0F}",
      "\u{1F495}", "\u{1F49E}", "\u{1F493}", "\u{1F497}", "\u{1F496}", "\u{1F498}",
      "\u{1F49D}", "\u{1F49F}", "\u{262E}\u{FE0F}", "\u{271D}\u{FE0F}", "\u{262A}\u{FE0F}",
      "\u{1F549}\u{FE0F}", "\u{2638}\u{FE0F}", "\u{2721}\u{FE0F}", "\u{1F52F}",
      "\u{1F54E}", "\u{262F}\u{FE0F}", "\u{26CE}", "\u{2648}", "\u{2649}", "\u{264A}",
      "\u{264B}", "\u{264C}", "\u{264D}", "\u{264E}", "\u{264F}", "\u{2650}",
      "\u{2651}", "\u{2652}", "\u{2653}", "\u{26A0}\u{FE0F}", "\u{267B}\u{FE0F}",
      "\u{269C}\u{FE0F}", "\u{1F531}", "\u{1F52E}", "\u{1F3E7}", "\u{2705}",
      "\u{274C}", "\u{274E}", "\u{2B55}", "\u{1F4AF}", "\u{1F51F}", "\u{0023}\u{FE0F}\u{20E3}",
      "\u{002A}\u{FE0F}\u{20E3}", "\u{0030}\u{FE0F}\u{20E3}", "\u{0031}\u{FE0F}\u{20E3}",
      "\u{0032}\u{FE0F}\u{20E3}", "\u{0033}\u{FE0F}\u{20E3}", "\u{0034}\u{FE0F}\u{20E3}",
      "\u{0035}\u{FE0F}\u{20E3}", "\u{0036}\u{FE0F}\u{20E3}", "\u{0037}\u{FE0F}\u{20E3}",
      "\u{0038}\u{FE0F}\u{20E3}", "\u{0039}\u{FE0F}\u{20E3}", "\u{1F51F}",
      "\u{1F520}", "\u{1F521}", "\u{1F522}", "\u{1F523}", "\u{1F524}", "\u{1F170}\u{FE0F}",
      "\u{1F18E}", "\u{1F171}\u{FE0F}", "\u{1F191}", "\u{1F192}", "\u{1F193}",
      "\u{2139}\u{FE0F}", "\u{1F194}", "\u{24C2}\u{FE0F}", "\u{1F195}", "\u{1F196}",
      "\u{1F17E}\u{FE0F}", "\u{1F197}", "\u{1F17F}\u{FE0F}", "\u{1F198}", "\u{1F199}",
      "\u{1F19A}", "\u{1F201}", "\u{1F202}\u{FE0F}", "\u{1F237}\u{FE0F}", "\u{1F236}",
      "\u{1F22F}", "\u{1F250}", "\u{1F239}", "\u{1F21A}", "\u{1F232}", "\u{1F251}",
      "\u{25AA}\u{FE0F}", "\u{25AB}\u{FE0F}", "\u{25FC}\u{FE0F}", "\u{25FB}\u{FE0F}",
      "\u{25FE}", "\u{25FD}", "\u{2B1B}", "\u{2B1C}", "\u{1F536}", "\u{1F537}",
      "\u{1F538}", "\u{1F539}", "\u{1F53A}", "\u{1F53B}", "\u{1F4A0}", "\u{1F518}",
      "\u{1F534}", "\u{1F535}", "\u{26AA}", "\u{26AB}",
    ],
  },
  {
    name: "Flags",
    emojis: [
      "\u{1F1FA}\u{1F1F8}", "\u{1F1EC}\u{1F1E7}", "\u{1F1E9}\u{1F1EA}",
      "\u{1F1EB}\u{1F1F7}", "\u{1F1EA}\u{1F1F8}", "\u{1F1EE}\u{1F1F9}",
      "\u{1F1EF}\u{1F1F5}", "\u{1F1E8}\u{1F1F3}", "\u{1F1F7}\u{1F1FA}",
      "\u{1F1E7}\u{1F1F7}", "\u{1F1EE}\u{1F1F3}", "\u{1F1E6}\u{1F1FA}",
      "\u{1F1E8}\u{1F1E6}", "\u{1F1F2}\u{1F1FD}", "\u{1F1F0}\u{1F1F7}",
      "\u{1F1F5}\u{1F1F1}", "\u{1F1F3}\u{1F1F1}", "\u{1F1E7}\u{1F1EA}",
      "\u{1F1E8}\u{1F1ED}", "\u{1F1E6}\u{1F1F9}", "\u{1F1F8}\u{1F1EA}",
      "\u{1F1F3}\u{1F1F4}", "\u{1F1E9}\u{1F1F0}", "\u{1F1EB}\u{1F1EE}",
      "\u{1F1EE}\u{1F1EA}", "\u{1F1F5}\u{1F1F9}", "\u{1F1EC}\u{1F1F7}",
      "\u{1F1F9}\u{1F1F7}", "\u{1F1E6}\u{1F1F1}", "\u{1F1FD}\u{1F1F0}",
      "\u{1F1F2}\u{1F1EA}", "\u{1F1F7}\u{1F1F8}", "\u{1F1ED}\u{1F1F7}",
      "\u{1F1E7}\u{1F1E6}", "\u{1F1F8}\u{1F1EE}", "\u{1F1F2}\u{1F1F0}",
      "\u{1F1E7}\u{1F1EC}", "\u{1F1F7}\u{1F1F4}", "\u{1F1ED}\u{1F1FA}",
      "\u{1F1E8}\u{1F1FF}", "\u{1F1F8}\u{1F1F0}", "\u{1F1FA}\u{1F1E6}",
      "\u{1F1EA}\u{1F1EC}", "\u{1F1F8}\u{1F1E6}", "\u{1F1E6}\u{1F1EA}",
      "\u{1F1EE}\u{1F1F1}", "\u{1F1F9}\u{1F1ED}", "\u{1F1FB}\u{1F1F3}",
      "\u{1F1F5}\u{1F1ED}", "\u{1F1F2}\u{1F1FE}", "\u{1F1F8}\u{1F1EC}",
      "\u{1F1EE}\u{1F1E9}", "\u{1F1F3}\u{1F1FF}", "\u{1F1FF}\u{1F1E6}",
      "\u{1F1F3}\u{1F1EC}", "\u{1F1F0}\u{1F1EA}", "\u{1F1E6}\u{1F1F7}",
      "\u{1F1E8}\u{1F1F1}", "\u{1F1E8}\u{1F1F4}", "\u{1F1F5}\u{1F1EA}",
      "\u{1F3F3}\u{FE0F}", "\u{1F3F4}", "\u{1F3C1}", "\u{1F6A9}",
      "\u{1F3F3}\u{FE0F}\u{200D}\u{1F308}",
    ],
  },
];

const CATEGORY_LABELS: Record<string, string> = {
  Smileys: "Smileys",
  People: "People",
  Animals: "Animals",
  Food: "Food",
  Travel: "Travel",
  Activities: "Activities",
  Objects: "Objects",
  Symbols: "Symbols",
  Flags: "Flags",
};

export default function EmojiPickerTool() {
  const t = useTranslations("tools.emoji-picker");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Smileys");
  const [recentlyCopied, setRecentlyCopied] = useState<string[]>([]);

  const filteredEmojis = useMemo(() => {
    if (!search.trim()) return null;
    const query = search.toLowerCase();
    const allEmojis: string[] = [];
    for (const cat of EMOJI_DATA) {
      for (const emoji of cat.emojis) {
        // Simple search - match against category name or emoji itself
        if (cat.name.toLowerCase().includes(query)) {
          allEmojis.push(emoji);
        }
      }
    }
    // If no category match, return all emojis (user may want to see them by scrolling)
    if (allEmojis.length === 0) {
      // Return empty to show no results
      return [];
    }
    return allEmojis;
  }, [search]);

  const copyEmoji = async (emoji: string) => {
    try {
      await navigator.clipboard.writeText(emoji);
      toast(t("copied_toast", { emoji }));
      setRecentlyCopied((prev) => {
        const updated = [emoji, ...prev.filter((e) => e !== emoji)].slice(0, 24);
        return updated;
      });
    } catch {
      // fallback
    }
  };

  const currentCategory = EMOJI_DATA.find((c) => c.name === activeCategory);

  return (
    <ToolLayout toolSlug="emoji-picker">
      <div className="space-y-6">
        {/* Search */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("search_placeholder")}
          className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
        />

        {/* Recently Copied */}
        {recentlyCopied.length > 0 && (
          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="text-sm font-medium text-foreground mb-2">
              {t("recently_copied")}
            </h3>
            <div className="flex flex-wrap gap-1">
              {recentlyCopied.map((emoji, i) => (
                <button
                  key={`recent-${i}`}
                  onClick={() => copyEmoji(emoji)}
                  className="w-10 h-10 flex items-center justify-center text-xl hover:bg-surface rounded-lg transition-colors"
                  title={emoji}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search results or Category view */}
        {filteredEmojis !== null ? (
          <div className="bg-card border border-border rounded-xl p-4">
            {filteredEmojis.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                {t("no_results")}
              </p>
            ) : (
              <div className="flex flex-wrap gap-1">
                {filteredEmojis.map((emoji, i) => (
                  <button
                    key={`search-${i}`}
                    onClick={() => copyEmoji(emoji)}
                    className="w-10 h-10 flex items-center justify-center text-xl hover:bg-surface rounded-lg transition-colors"
                    title={emoji}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Category tabs */}
            <div className="flex gap-1 overflow-x-auto pb-1">
              {EMOJI_DATA.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                    activeCategory === cat.name
                      ? "bg-teal text-white"
                      : "bg-surface text-foreground hover:bg-border"
                  }`}
                >
                  {CATEGORY_LABELS[cat.name]}
                </button>
              ))}
            </div>

            {/* Emoji grid */}
            {currentCategory && (
              <div className="bg-card border border-border rounded-xl p-4">
                <div className="flex flex-wrap gap-1">
                  {currentCategory.emojis.map((emoji, i) => (
                    <button
                      key={`${activeCategory}-${i}`}
                      onClick={() => copyEmoji(emoji)}
                      className="w-10 h-10 flex items-center justify-center text-xl hover:bg-surface rounded-lg transition-colors"
                      title={emoji}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </ToolLayout>
  );
}
