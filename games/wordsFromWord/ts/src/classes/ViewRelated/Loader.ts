class Loader{
    private box: JQuery;

    constructor(){
        this.box = $('#loader');
    }

    public show():void{
        this.box.show();
    }

    public hide():void{
        this.box.hide();
    }
}