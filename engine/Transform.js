class Transform extends Component{
    name = "Transform"
    
    x = 0
    y = 0
    sx = 1
    sy = 1
    r = 0

    static fromTo(startX, startY, endX, endY){
        let t = new Transform();
        t.x = (startX + endX)/2
        t.y = (startY + endY)/2
        let length = Math.sqrt((startX - endX)**2+(startY - endY)**2)
        t.sx = length/2
        t.sy = 1
        t.r = Math.atan2((endY - startY), (endX - startX));
    
        return t;
      }
    }
    
window.Transform = Transform;
