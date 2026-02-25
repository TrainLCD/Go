import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useMemo } from "react";
import { type Route, StopCondition, type TrainType } from "@/types/stationapi";
import dropEitherJunctionStation from "@/utils/dropJunctionStation";
import { removeBrackets } from "@/utils/removeBracket";
import { CloseSmallRoundedIcon } from "./icons/CloseSmallRounded";

type Props = {
  isOpen: boolean;
  onOpenChange: () => void;
  modalContent: {
    id: number | undefined;
    lineName: string | undefined;
    trainType: TrainType | undefined;
  };
  route: Route | undefined;
  onLaunchApp: () => void;
};

const StopIcon = ({ color }: { color: string }) => (
  <svg width="14" height="14" viewBox="0 0 14 14">
    <circle cx="7" cy="7" r="5.5" fill={color} />
  </svg>
);

const PassIcon = ({ color }: { color: string }) => (
  <svg width="14" height="14" viewBox="0 0 14 14">
    <line
      x1="1"
      y1="7"
      x2="13"
      y2="7"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);

const PartialIcon = ({ color }: { color: string }) => (
  <svg width="14" height="14" viewBox="0 0 14 14">
    <polygon points="7,1.5 13,12.5 1,12.5" fill={color} />
  </svg>
);

const WeekdayIcon = ({ color }: { color: string }) => (
  <svg width="14" height="14" viewBox="0 0 14 14">
    <rect x="0.5" y="0.5" width="13" height="13" rx="2" fill={color} />
    <text
      x="7"
      y="10.5"
      textAnchor="middle"
      fill="white"
      fontSize="9"
      fontWeight="bold"
    >
      平
    </text>
  </svg>
);

const HolidayIcon = ({ color }: { color: string }) => (
  <svg width="14" height="14" viewBox="0 0 14 14">
    <rect x="0.5" y="0.5" width="13" height="13" rx="2" fill={color} />
    <text
      x="7"
      y="10.5"
      textAnchor="middle"
      fill="white"
      fontSize="9"
      fontWeight="bold"
    >
      休
    </text>
  </svg>
);

const STOP_CONDITIONS = [
  { id: StopCondition.All, text: "停車", color: "#000000", Icon: StopIcon },
  { id: StopCondition.Not, text: "通過", color: "#99a1af", Icon: PassIcon },
  {
    id: StopCondition.Partial,
    text: "一部通過",
    color: "#fcc800",
    Icon: PartialIcon,
  },
  {
    id: StopCondition.PartialStop,
    text: "一部停車",
    color: "#fcc800",
    Icon: PartialIcon,
  },
  {
    id: StopCondition.Weekday,
    text: "平日停車",
    color: "#51a2ff",
    Icon: WeekdayIcon,
  },
  {
    id: StopCondition.Holiday,
    text: "休日停車",
    color: "#ff6467",
    Icon: HolidayIcon,
  },
] as const;

export const RouteInfoModal = ({
  isOpen,
  onOpenChange,
  modalContent,
  route,
  onLaunchApp,
}: Props) => {
  const linesByCompany = useMemo(() => {
    const uniqueLines = Array.from(
      new Map(route?.stops.map((stop) => [stop.line?.id, stop])).values(),
    );
    const companyMap = new Map<
      number,
      { lineNames: string[]; stop: (typeof uniqueLines)[number] }
    >();
    for (const stop of uniqueLines) {
      const companyId = stop.line?.company?.id;
      if (companyId == null) continue;
      const existing = companyMap.get(companyId);
      if (existing) {
        const name = stop.line?.nameShort;
        if (name && !existing.lineNames.includes(name)) {
          existing.lineNames.push(name);
        }
        if (!existing.stop.trainType && stop.trainType) {
          existing.stop = stop;
        }
      } else {
        companyMap.set(companyId, {
          lineNames: stop.line?.nameShort ? [stop.line.nameShort] : [],
          stop,
        });
      }
    }
    return Array.from(companyMap.values());
  }, [route?.stops]);

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} hideCloseButton>
      <ModalContent className="max-h-[90svh] my-auto flex flex-col">
        {(onClose) => (
          <>
            <ModalHeader className="bg-white border-b-1 shadow-sm flex-shrink-0">
              <div className="flex flex-1 justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold">{modalContent.lineName}</span>
                  <span
                    className="text-sm font-semibold px-1.5 py-0.5 rounded"
                    style={{
                      color: modalContent.trainType?.color,
                      backgroundColor: `${modalContent.trainType?.color}14`,
                    }}
                  >
                    {removeBrackets(modalContent.trainType?.name ?? "")}
                  </span>
                </div>
                <button
                  onClick={onClose}
                  aria-label="閉じる"
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <CloseSmallRoundedIcon className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </ModalHeader>

            <ModalBody className="gap-5 py-5 overflow-y-auto">
              <section>
                <h2 className="font-bold text-sm text-gray-500 mb-2">停車駅</h2>
                <ul className="flex flex-wrap gap-x-1.5 gap-y-1 list-none pl-0 text-[15px] leading-relaxed">
                  {dropEitherJunctionStation(route?.stops ?? []).flatMap(
                    (stop) => {
                      const cnd = STOP_CONDITIONS.find(
                        (c) => c.id === stop.stopCondition,
                      );
                      return (
                        <li
                          key={stop.id}
                          className="inline-flex items-center gap-0.5"
                          style={{
                            color: cnd?.color,
                            fontWeight:
                              stop.stopCondition === StopCondition.All
                                ? 500
                                : 400,
                          }}
                        >
                          {cnd && stop.stopCondition !== StopCondition.All && (
                            <cnd.Icon color={cnd.color} />
                          )}
                          {stop.name}
                        </li>
                      );
                    },
                  )}
                </ul>
                <div className="flex gap-2 flex-wrap mt-2 pt-2 border-t border-gray-100">
                  {STOP_CONDITIONS.map((cnd) => (
                    <div
                      className="flex items-center gap-1 text-xs text-gray-600"
                      key={cnd.id}
                    >
                      <cnd.Icon color={cnd.color} />
                      <span>{cnd.text}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="font-bold text-sm text-gray-500 mb-2">
                  各線の種別
                </h2>
                <div className="flex flex-col gap-0.5">
                  {linesByCompany.map(({ stop }) => (
                    <div
                      key={stop.line?.company?.id}
                      className="flex items-center justify-between py-1 px-3 rounded-lg bg-gray-50"
                    >
                      <span className="text-sm text-gray-700">
                        {stop.line?.company?.nameShort}線
                      </span>
                      <span
                        className="text-sm font-bold"
                        style={{ color: stop.trainType?.color }}
                      >
                        {removeBrackets(
                          stop.trainType?.name ?? "普通または各駅停車",
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            </ModalBody>

            <ModalFooter className="border-t border-gray-100 gap-2 flex-shrink-0">
              <Button
                color="primary"
                variant="flat"
                className="font-semibold"
                onPress={onLaunchApp}
              >
                アプリを起動
              </Button>
              <Button color="default" variant="light" onPress={onClose}>
                閉じる
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
