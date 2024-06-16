import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {CardHeader, CardTitle} from "@/components/ui/card.tsx";


const DailyPopup = ({defaultOpen = false}) => {
  return (
      <Dialog defaultOpen={defaultOpen}>
        <DialogContent className="px-0 pb-0 max-w-6xl">
          <DialogHeader className="px-6">
            <DialogTitle className="text-primary">Message du jour</DialogTitle>
          </DialogHeader>
          <div className="border-t">
            <CardHeader>
              <CardTitle className="text-secondary-foreground flex flex-col gap-2">
                <div> Je suis à la recherche de :</div>
                <div>- Endium ingot</div>
                <div>- Endium nugget</div>
                <div>- Endium pickaxe</div>
                <div>- Endium axe</div>
                <div>- Endium battery</div>
                <div>- Cloche magique en endium</div>
                <div>- Endium stone heart</div>
                <div>- Endium dynamite (même si je crois qu'il y en a pas en circulation)</div>
                <div>Si vous en avez mp moi discord : bromine__</div>
              </CardTitle>
            </CardHeader>
          </div>
        </DialogContent>
      </Dialog>)
}

export default DailyPopup;