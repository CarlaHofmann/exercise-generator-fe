import {ExerciseAbstract, Solution} from "../../../build/openapi";

export class ImageConnection {
    private _connector: ExerciseAbstract | Solution;
    private _images: File[] = [];

    public constructor(connector: ExerciseAbstract | Solution) {
        this._connector = connector;
    }

    set connector(connector: ExerciseAbstract | Solution){
        this._connector = connector;
    }

    set images(images: File[]){
        this._images = images;
    }

    get connector(): ExerciseAbstract | Solution{
        return this._connector;
    }

    get images(): File[]{
        return this._images;
    }
}
