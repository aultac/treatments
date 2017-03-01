export default module => {

  module.addState({ 
    isSmall: true, // changes to true for mobile, false for computer
    orientation: 'portrait', // portrait | landscape
  });

  module.addSignals({

    resized: [ ({input,state}) => { 
      const orientation = (input.width > input.height ? 'landscape' : 'portrait');
      if (state.get('window.orientation') !== orientation) state.set('window.orientation', orientation);
      
      const isSmall = (orientation === 'portrait' ? (input.width < 767) : (input.height < 500));
      if (state.get('window.isSmall') !== isSmall) state.set('window.isSmall', isSmall);
    } ],

  });

}
