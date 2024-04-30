function ShowSelectedComponent({showSelectedFlag,setShowSelectedFlag}) {
    const handleClick = () => {
        if (showSelectedFlag == true){
            setShowSelectedFlag(false);
        } else {
            setShowSelectedFlag(true);
        }
        
    }
    return (
        <button style={{padding:"0 5px"}} onClick={handleClick}>
            Show Only Selected Events
        </button>
    );
}

export default ShowSelectedComponent;


