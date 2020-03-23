import React, { useState, useRef, useEffect } from 'react';
import Logo from '../Images/Logo64.png';

const totalKeyArray = ['confirmed', 'recovered', 'deaths'];

function ListView(props) {
    // Props, States
    const { 
        locationArray, 
        selectedLocation, 
        isLoading, 
        onSelectItem, 
        onDeselectItem 
    } = props;
    const [isOnTablet, setIsOnTablet] = useState(false);
    const [isOnDesktop, setIsOnDesktop] = useState(true);

    const listLocationsRef = useRef(null);

    // Functions
    function onClickItem(id) {
        setIsOnTablet(false);
        if (selectedLocation === null) onSelectItem(id);
        else if (selectedLocation.id !== id) onSelectItem(id);
        else onDeselectItem();
    }

    function scrollToSelected(location) {
        if (location === null) return;

        const parentBounds = listLocationsRef.current.getBoundingClientRect();
        const childArray = Array.from(listLocationsRef.current.childNodes);
        const selectedChild = childArray.find(child => {
            return child.getAttribute('data-id') === `${location.id}`
        });
        if (selectedChild === undefined) return;

        const childBounds = selectedChild.getBoundingClientRect();

        const isExceedTop = childBounds.top < parentBounds.top;
        const isExceedBottom = childBounds.bottom > parentBounds.bottom;
        if (isExceedTop || isExceedBottom) {
            listLocationsRef.current.scrollTop = selectedChild.offsetTop - 20;
        }
    }

    // Effects
    useEffect(() => {
        scrollToSelected(selectedLocation);
    }, [selectedLocation]);

    // Elements
    const totalDataElements = totalKeyArray.map(key => {
        const title = key.charAt(0).toUpperCase() + key.slice(1);
        const count = locationArray.reduce((sum, location) => {
            return sum + location.latest[key];
        }, 0);

        let titleClass = 'title is-6';
        if (key === 'recovered') titleClass += ' has-text-success';
        else if (key === 'deaths') titleClass += ' has-text-danger';

        return (
            <div key={key} className="columns is-mobile">
                <div className="column is-8">
                    <h6 className={titleClass}>{title}</h6>
                </div>
                <div className="column">
                    <p className="is-6 has-text-right">{count.toLocaleString('en')}</p>
                </div>
            </div>
        );
    });
    let totalElements = (
        <>
            <h4 className="title is-4">Total</h4>
            {totalDataElements}
        </>
    );

    let locationElements = locationArray.map(location => {
        const {
            id, country, country_code, province,
            latest: { confirmed }
        } = location;

        let title = country;
        if (province !== '' && province !== country) {
            title = `${province}, ${country}`;
        }
        let locationClass = 'list-view__location';
        if (selectedLocation !== null) {
            if (location.id === selectedLocation.id) {
                locationClass += ' selected';
            }
        }

        return (
            <div key={`${id}-${country_code}`} className={locationClass} onClick={_ => onClickItem(id)} data-id={id}>
                <div className="columns is-mobile">
                    <div className="column is-8">
                        <h6 className="title is-6">{title}</h6>
                    </div>
                    <div className="column">
                        <p className="is-6 has-text-right">{confirmed.toLocaleString('en')}</p>
                    </div>
                </div>
            </div>
        );
    });

    let loadingView = null;
    if (isLoading) {
        totalElements = null;
        locationElements = null;
        loadingView = (
            <div className="list-view__loading">
                <span className="icon">
                    <i className="fas fa-circle-notch fa-lg fa-spin" ></i>
                </span>
            </div>
        );
    }
    
    let listviewClass = 'list-view';
    let tabletIconClass = 'icon is-medium';
    let desktopIconClass = 'icon is-medium';
    if (isOnTablet) {
        listviewClass += ' is-on-tablet';
        tabletIconClass += ' is-rotate-180';
    }
    if (isOnDesktop) {
        listviewClass += ' is-on-desktop';
        desktopIconClass += ' is-rotate-180';
    }

    return (
        <div className={listviewClass}>
            <div className="list-view__switch is-hidden-desktop" onClick={_ => setIsOnTablet(prev => !prev)}>
                <span className={tabletIconClass}>
                    <i className="fas fa-angle-double-right fa-lg"></i>
                </span>
            </div>
            <div className="list-view__switch is-hidden-touch" onClick={_ => setIsOnDesktop(prev => !prev)}>
                <span className={desktopIconClass}>
                    <i className="fas fa-angle-double-right fa-lg"></i>
                </span>
            </div>
            <div className="list-view__content">
                <div className="list-view__brand">
                    <h1 className="title is-5">COVID-19 Tracker</h1>
                    <h3 className="subtitle is-7">by Zinglecode</h3>
                    <img className="list-view__logo" src={Logo} alt="zinglecode" />
                </div>
                <div className="list-view__stat">
                    {loadingView}
                    {totalElements}
                </div>
                <div className="list-view__locations" ref={listLocationsRef}>
                    {loadingView}
                    {locationElements}
                </div>
                <div className="list-view__credit">
                    <p className="is-size-7">
                        <a href="https://github.com/potchangelo/covid-19-tracker" target="_blank" rel="noopener noreferrer">Project Github</a>
                        <a href="https://github.com/ExpDev07/coronavirus-tracker-api" target="_blank" rel="noopener noreferrer">Data API Github</a>
                    </p>
                    <p className="is-size-7">&copy; 2020 Zinglecode</p>
                </div>
            </div>
        </div>
    );
}

export default ListView;