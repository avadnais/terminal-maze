const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
    constructor(field){
        this._field = field;
        this._curX = 0;
        this._curY = 0;
        this._dead = false;
        this._win = false;
        this._deadMessage = "";
        this._winMessage = "You found your hat!"
    }
    get dead(){
        return this._dead;
    }
    get win(){
        return this._win;
    }
    get winMessage(){
        return this._winMessage;
    }
    get deadMessage(){
        return this._deadMessage;
    }
    print(){
        for(let i = 0; i < this._field.length; i++){
            console.log(this._field[i].join(""))
        }
    }
    move(direction){
        this.updateLocation(direction);
        this.checkLocationForItems();
        this.checkOutOfBounds();

        this._field[this._curY][this._curX] = "*"
    }

    updateLocation(direction){
        switch(direction){
            case('w'): 
                this._curY--;
                break;
            case('s'):
                this._curY++;
                break;
            case('a'):
                this._curX--;
                break;
            case('d'):
                this._curX++;
                break;
        }
    }

    checkLocationForItems(){
        let val = this._field[this._curY][this._curX]
        if(val === hat){
            this._win = true;
        }
        if(val === hole){
            this._dead = true;
            this._deadMessage = "You fell in a hole";
        }
    }

    checkOutOfBounds(){
        if(this._curX < 0 || this._curY < 0){
            this._dead = true;
            this._deadMessage = "You fell off the map";
        }
    }

    static generateField(lenY, lenX, chanceOfHoles){
        let f = []
        for(let y = 0; y < lenY; y++){
            let inline = []
            for(let x = 0; x < lenX; x++){
                let r = Math.random();
                if(r < chanceOfHoles)
                    inline.push(hole);
                else 
                    inline.push(fieldCharacter);
            }
            f.push(inline);
        }

        let randY = Math.floor(Math.random() * lenY);
        let randX = Math.floor(Math.random() * lenX);
        /* avoid case that hat is at index 0, 0 */
        while(randY === 0 && randX === 0){
            let randY = Math.floor(Math.random() * lenY);
            let randX = Math.floor(Math.random() * lenX);
        }
        f[randY][randX] = hat;
        f[0][0] = pathCharacter;
        return f;
    }

    set field(f){
        this._field = f;
    }
}

const myField = new Field();
myField.field = Field.generateField(25,25,.25);
myField.print();

while(true){
    if(myField.win){
        console.log(myField.winMessage);
        break;
    } 
    else if (myField.dead){
        console.log(myField.deadMessage);
        break;
    }
    const direction = prompt('Enter a direction to move...');
    myField.move(direction);
    myField.print();
}

