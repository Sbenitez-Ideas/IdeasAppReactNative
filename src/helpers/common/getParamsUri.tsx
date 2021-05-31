export const getParamsUri = ( link: string ) => {
    const haveParams = link.indexOf( '?' );
    if ( haveParams ) {
        const regexParams = new RegExp( /\?(.*?)\=/ );
        const findParam = regexParams.exec( link ) as RegExpExecArray;
        const nameParam = findParam[1];
        const param = link.substr(link.indexOf("=") + 1); 
        const screen= link.substr(0, link.indexOf('?')); 
        
        return {
            param,
            nameParam,
            screen
        }
    } else  {
        return {
            link
        }
    }
    

        


}