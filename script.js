class Clock extends React.Component {
    constructor(props) {
        super(props)
        this.reset = this.reset.bind(this)
        this.breakDecrement = this.breakDecrement.bind(this)
        this.breakIncrement = this.breakIncrement.bind(this)
        this.sessionDecrement = this.sessionDecrement.bind(this)
        this.sessionIncrement = this.sessionIncrement.bind(this)
        this.countDown = this.countDown.bind(this)
        this.startStop = this.startStop.bind(this)
        this.beeper = this.beeper.bind(this)
        this.breakSessionToggle = this.breakSessionToggle.bind(this)
        this.state = {
            breakCount: 5,
            sessionCount: 25,
            timer: 1500,
            breakTimer: 300,
            sessionTimer: 1500,
            timerTitle: 'Session',
            isSession: true,
            countDownActive: false
        }
    }

    //RESET BUTTON
    reset() {
        this.setState({
                breakCount: 5,
                sessionCount: 25,
                timer: 1500,
                breakTimer: 300,
                sessionTimer: 1500,
                timerTitle: 'Session',
                isSession: true,
                countDownActive: false
        })
        document.getElementById('beep').pause()
        document.getElementById('beep').currentTime = 0
    }

    //BREAK ADJUSTERS
    breakDecrement() {
        if (this.state.breakCount > 1) {
            this.setState(prevState => {
                return {
                    breakCount: prevState.breakCount - 1,
                    breakTimer: prevState.breakTimer - 60
                }
            })
        } 
    }

    breakIncrement() {
        if (this.state.breakCount < 60) {
            this.setState(prevState => {
                return {
                    breakCount: prevState.breakCount + 1,
                    breakTimer: prevState.breakTimer + 60
                }
            })
        }  
    }

    //SESSION ADJUSTERS
    sessionDecrement() {
        if (this.state.sessionCount > 1) {
            this.setState(prevState => {
                return {
                    sessionCount: prevState.sessionCount - 1,
                    timer: prevState.timer - 60,
                    sessionTimer: prevState.sessionTimer - 60
                }
            })
        } 
    }

    sessionIncrement() {
        if (this.state.sessionCount < 60) {
            this.setState(prevState => {
                return {
                    sessionCount: prevState.sessionCount + 1,
                    timer: prevState.timer + 60,
                    sessionTimer: prevState.sessionTimer + 60
                }
            })
        }  
    }

    //COUNTDOWN FUNCTIONS
    countDown() {
        if (this.state.countDownActive) {
            this.setState(prevState => {
                return {timer: prevState.timer - 1}
            })
        }

        if (this.state.timer === 0) {
            this.beeper()
        }

        if (this.state.timer === -1) {
            this.breakSessionToggle()
        }
    }

    componentDidMount() {
        this.interval = setInterval(() => this.countDown(), 1000)
    }

    componentWillUnmount() {
        clearInterval(this.interval)
    }

    //START/STOP BUTTON
    startStop() {
        if (this.state.countDownActive === false) {
            this.setState({
                countDownActive: true
            })
        } else {
            this.setState({
                countDownActive: false
            })
        }
    }

    //BREAK/SESSION TOGGLER
    breakSessionToggle() {
        if (this.state.isSession === true) {
            this.setState(prevState => ({
                timer: prevState.breakTimer,
                timerTitle: 'Break',
                isSession: false
            }))
        } else {
            this.setState(prevState => ({
                timer: prevState.sessionTimer,
                timerTitle: 'Session',
                isSession: true
            }))
        }
    }

    //ALARM
    beeper() {
        document.getElementById('beep').play()
    }

    render() {
        return (
            <div className="container" id="clock">
                <div className="row justify-content-around" id="settings">
                    <div className="col-sm-3" id="break">
                        <Break 
                            breakCount={this.state.breakCount}
                            breakDecrement={this.breakDecrement}
                            breakIncrement={this.breakIncrement}
                        />
                    </div>
                    <div className="col-sm-3" id="session">
                        <Session 
                            sessionCount={this.state.sessionCount}
                            sessionDecrement={this.sessionDecrement}
                            sessionIncrement={this.sessionIncrement}
                        />
                    </div>
                </div>
                <div className="row">
                    <div id="timer">
                        <Timer 
                            title={this.state.timerTitle}
                            reset={this.reset}
                            timer={this.state.timer}
                            startStop={this.startStop}
                        />
                    </div>
                    <div id="speaker">
                        <Speaker />
                    </div>
                </div>
            </div>
        )
    }
}

const Break = (props) => {
    return (
        <div className="container" id="break-section">
            <h2 className="labels" id="break-label">Break Length</h2>
            <div className="d-flex justify-content-around">
                <i class="fas fa-angle-double-down up-down-arrows" id="break-decrement" onClick={props.breakDecrement}></i>
                <h4 className="settings-display" id="break-length">{props.breakCount}</h4>
                <i class="fas fa-angle-double-up up-down-arrows" id="break-increment" onClick={props.breakIncrement}></i>
            </div>
        </div>
    )
}

const Session = (props) => {
    return (
        <div className="container" id="session-section">
            <h2 className="labels" id="session-label">Session Length</h2>
            <div className="d-flex justify-content-around">
                <i class="fas fa-angle-double-down up-down-arrows" id="session-decrement" onClick={props.sessionDecrement}></i>
                <h4 className="settings-display" id="session-length">{props.sessionCount}</h4>
                <i class="fas fa-angle-double-up up-down-arrows" id="session-increment" onClick={props.sessionIncrement}></i>
            </div>
        </div>
    )
}

const Timer = (props) => {
    function timerCountdown() {
        let minutes = Math.floor(props.timer / 60)
        let seconds = props.timer % 60
        return (
            (minutes < 10 ? `0${minutes}` : `${minutes}`) + ":" + (seconds < 10 ? `0${seconds}` : `${seconds}`)
        )
    }

    return (
        <div className="container" id="timer-section">
            <h2 id="timer-label">{props.title}</h2>
            <div>
                <h1 id="time-left">{timerCountdown()}</h1>
                <div className="row justify-content-around">
                    <div className="col-3">
                        <img className="main-buttons" src="https://img.icons8.com/ios-filled/50/000000/resume-button.png" id="start_stop" onClick={props.startStop}/>
                    </div>
                    <div className="col-3">
                        <i class="fas fa-undo main-buttons" id="reset" onClick={props.reset}></i>
                    </div>
                </div>
            </div>
        </div>
    )
}

const Speaker = () => {
    return (
        <audio id="beep" preload="auto" src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"></audio>
    )
}

const App = () => {
    return (
        <Clock />
    )
}

ReactDOM.render(<App />, document.getElementById('root'))