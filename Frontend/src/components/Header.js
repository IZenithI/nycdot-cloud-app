import React from 'react'
import PropTypes from 'prop-types'
import Button from './Button'


const Header = ({title, onAdd, showDataForm, emptyEntry,scrollTop}) => {

    return (
        <header className='header'>
            <h1>{title} </h1>
            <Button color='black' text={showDataForm? 'Close Data Form' : 'Open Data Form'} onClick = {onAdd} onMouseDown = {emptyEntry} onMouseUp = {scrollTop}/>

        </header>
    )
}

Header.defaultProps = {
    title: 'SDG Data',
}

const headingStyle = {
    color:'red',
    backgroundColor: 'black',
}

Header.propTypes = {
    title: PropTypes.string,
}
export default Header
