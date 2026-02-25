import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import type { TrainType } from "@/types/stationapi";
import { removeBrackets } from "@/utils/removeBracket";
import { CloseSmallRoundedIcon } from "./icons/CloseSmallRounded";

type Props = {
  isOpen: boolean;
  onOpenChange: () => void;
  trainType: TrainType | undefined;
  onLaunchApp: () => void;
};

export const RouteInfoModal = ({
  isOpen,
  onOpenChange,
  trainType,
  onLaunchApp,
}: Props) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent className="overflow-y-scroll max-h-svh">
        {(onClose) => (
          <>
            <ModalHeader className="sticky top-0 bg-white border-b-1 shadow-sm">
              <div className="flex flex-1 justify-between align-center h-full">
                <div className="flex items-center">
                  <span>{trainType?.line?.nameShort}</span>
                  <span
                    className="ml-1 text-sm"
                    style={{ color: trainType?.color }}
                  >
                    {removeBrackets(trainType?.name ?? "")}
                  </span>
                </div>
                <button onClick={onClose} aria-label="閉じる">
                  <CloseSmallRoundedIcon />
                </button>
              </div>
            </ModalHeader>

            <ModalBody>
              <p className="font-bold">経由路線: </p>
              <div className="whitespace-pre-wrap">
                {trainType?.lines.map((line) => (
                  <p key={line.id} className="flex flex-wrap items-center gap-1">
                    <span
                      className="w-3 h-3 rounded-full inline-block"
                      style={{ background: line.color }}
                    />
                    <span>{line.nameShort}</span>
                  </p>
                ))}
              </div>

              <p className="font-bold">種別情報: </p>
              <div className="flex flex-col gap-1">
                <p>
                  種別名: &nbsp;
                  <span style={{ color: trainType?.color }}>
                    {removeBrackets(trainType?.name ?? "")}
                  </span>
                </p>
                {trainType?.nameRoman && (
                  <p className="text-sm opacity-70">
                    {trainType.nameRoman}
                  </p>
                )}
                <p>種別区分: &nbsp;{trainType?.kind}</p>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" variant="flat" onPress={onLaunchApp}>
                アプリを起動
              </Button>
              <Button color="primary" variant="light" onPress={onClose}>
                閉じる
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
