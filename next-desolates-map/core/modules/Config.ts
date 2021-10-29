import SpaceRenderer from "../SpaceRenderer";

export default class Config {
    public cluster?: string = "";
    public stage?: number = 0;

    public getStage() {
        return this.stage;
    }

    public changeStage(newStage: number) {
        const { stage } = SpaceRenderer.getInstance();

        console.info(
            `Transitioning stage from: ${stage.toString(
                this.stage
            )} to ${stage.toString(newStage)}`
        );

        if (this.stage == newStage) {
            console.warn(`Already in stage ${stage.toString(newStage)}`);
            // console.trace();
        }

        this._unloadStage(this.stage);
        this._loadStage(newStage);
        this.stage = newStage;
    }

    public _unloadStage(oldStage: any) {
        const { stage } = SpaceRenderer.getInstance();

        switch (oldStage) {
            case stage.LOADING:
                break;
            case stage.CLUSTER_SELECTION:
                // _unloadClusterSelectionStage();
                break;
            case stage.CLUSTER_TRANSITION:
                // _unloadClusterTransitionStage();
                break;
            case stage.SPACE_NAVIGATION:
                // _unloadSpaceNavigationStage();
                break;
        }
    }

    public _loadStage(newStage: any) {
        const { stage } = SpaceRenderer.getInstance();

        switch (newStage) {
            case stage.LOADING:
                break;
            case stage.CLUSTER_SELECTION:
                // _loadClusterSelectionStage();
                break;
            case stage.CLUSTER_TRANSITION:
                // _loadClusterTransitionStage();
                break;
            case stage.SPACE_NAVIGATION:
                // _loadSpaceNavigationStage();
                break;
        }
    }
}
