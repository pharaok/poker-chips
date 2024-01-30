import { X } from "lucide-react";
import {
  Dialog,
  Heading,
  ModalOverlay,
  ModalOverlayProps,
  Modal as RAModal,
} from "react-aria-components";

export default function Modal({
  title,
  children,
  ...props
}: { title: string } & ModalOverlayProps) {
  return (
    <ModalOverlay
      {...props}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-all"
    >
      <RAModal
        {...props}
        className="relative rounded-2xl bg-gray-900 p-4 text-white"
      >
        <Dialog className="flex max-h-96 w-80 flex-col items-center justify-center gap-2 outline-none">
          {({ close }) => (
            <>
              {props.isDismissable && (
                <button
                  className="absolute right-4 top-4"
                  onClick={() => close()}
                >
                  <X />
                </button>
              )}
              <Heading slot="title" className=" text-2xl uppercase">
                {title}
              </Heading>
              <div className="-mr-6 max-h-full overflow-scroll">
                <div className="flex flex-col items-center justify-center gap-2 pr-6">
                  {children as React.ReactNode}
                </div>
              </div>
            </>
          )}
        </Dialog>
      </RAModal>
    </ModalOverlay>
  );
}
