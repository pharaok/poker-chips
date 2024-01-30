import Modal from "@repo/ui/modal";
import Card from "@repo/ui/card";

export default function HandRankingsModal({
  isOpen,
  setOpen,
}: {
  isOpen: boolean;
  setOpen: (v: boolean) => void;
}) {
  return (
    <Modal
      isDismissable
      isOpen={isOpen}
      onOpenChange={setOpen}
      title="HAND RANKINGS"
    >
      <div className="flex flex-col">
        <ol className="flex flex-col gap-2 [&>*]:flex [&>*]:flex-col [&>*]:items-center">
          <li>
            <h3>STRAIGHT FLUSH</h3>
            <div className="flex w-full gap-2 [&>*]:h-20">
              <Card>KS</Card>
              <Card>QS</Card>
              <Card>JS</Card>
              <Card>10S</Card>
              <Card>9S</Card>
            </div>
          </li>
          <li>
            <h3>FOUR OF A KIND</h3>
            <div className="flex w-full gap-2 [&>*]:h-20">
              <Card>JC</Card>
              <Card>JD</Card>
              <Card>JH</Card>
              <Card>JS</Card>
              <Card faceDown>AS</Card>
            </div>
          </li>
          <li>
            <h3>FULL HOUSE</h3>
            <div className="flex w-full gap-2 [&>*]:h-20">
              <Card>QC</Card>
              <Card>QD</Card>
              <Card>QH</Card>
              <Card>5S</Card>
              <Card>5S</Card>
            </div>
          </li>
          <li>
            <h3>FLUSH</h3>
            <div className="flex w-full gap-2 [&>*]:h-20">
              <Card>5D</Card>
              <Card>9D</Card>
              <Card>AD</Card>
              <Card>3D</Card>
              <Card>JD</Card>
            </div>
          </li>
          <li>
            <h3>STRAIGHT</h3>
            <div className="flex w-full gap-2 [&>*]:h-20">
              <Card>6D</Card>
              <Card>7S</Card>
              <Card>8C</Card>
              <Card>9C</Card>
              <Card>10H</Card>
            </div>
          </li>
          <li>
            <h3>THREE OF A KIND</h3>
            <div className="flex w-full gap-2 [&>*]:h-20">
              <Card>7D</Card>
              <Card>7S</Card>
              <Card>7C</Card>
              <Card faceDown>AS</Card>
              <Card faceDown>9H</Card>
            </div>
          </li>
          <li>
            <h3>TWO PAIR</h3>
            <div className="flex w-full gap-2 [&>*]:h-20">
              <Card>2D</Card>
              <Card>2S</Card>
              <Card>9C</Card>
              <Card>9S</Card>
              <Card faceDown>JH</Card>
            </div>
          </li>
          <li>
            <h3>PAIR</h3>
            <div className="flex w-full gap-2 [&>*]:h-20">
              <Card>8D</Card>
              <Card>8S</Card>
              <Card faceDown>9C</Card>
              <Card faceDown>9S</Card>
              <Card faceDown>9H</Card>
            </div>
          </li>
          <li>
            <h3>HIGH CARD</h3>
            <div className="flex w-full gap-2 [&>*]:h-20">
              <Card>AH</Card>
              <Card faceDown>2S</Card>
              <Card faceDown>9C</Card>
              <Card faceDown>9S</Card>
              <Card faceDown>9H</Card>
            </div>
          </li>
        </ol>
      </div>
    </Modal>
  );
}
