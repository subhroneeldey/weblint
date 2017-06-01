var ct=0,i=0;
var ch='.partnername';
var file=new String();
var newfile=new String();
var partnername="."
for(i=0;i<file.length;i++)
{
    ch=file.charAt(i);
    if(ch=='.'||ch=='#')
    {
        j=i+1;
        ch=file.charAt(j);
        while(ch.match(/'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890_'/))
        {
            j++;
            ch=file.charAt(j);
        }
        if(ch=='{')
        {
            newfile=file.substring(0,i)+partnername+file.substring(i+1);
            file=newfile;
        }
        i=next(file,j+1+partnername.length,1);
    }
}

next(file,i,count)
{
    if(count==0)
    return i;
    var ch=file[i];
    if(ch=='}')
    {
       return next(file,i+1,count-1);
    }
    else if(ch=='{')
    {
        return next(file,i+1,count+1);
    }
    else
    return next(file,i+1,count);

}
