import React from 'react'
import PropTypes from 'prop-types'
import Button from './Button'


const Header = ({title, onAdd, showDataForm, emptyEntry,scrollTop,isIntern}) => {

    return (
        <header className='header'>
            <h1>{title} </h1>

           { !isIntern&&<Button color='black' text={showDataForm? 'Close Data Form' : 'Open Data Form'} onClick = {onAdd} onMouseDown = {emptyEntry} onMouseUp = {scrollTop}/>}
           { (isIntern && showDataForm) &&<Button color='black' text='Close Data Form' onClick = {onAdd} onMouseDown = {emptyEntry} onMouseUp = {scrollTop}/>}

        </header>
    )
}

Header.defaultProps = {
    title: 'SDG Data Entry',
}

const headingStyle = {
    color:'red',
    backgroundColor: 'black',
}

Header.propTypes = {
    title: PropTypes.string,
}
export default Header
