#importing Dependencies
from flask import Flask, jsonify
import numpy as np
import pandas as pd
import datetime as dt
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, inspect, func

#Setting up tables
engine = create_engine("sqlite:///Resources/hawaii.sqlite")
Base = automap_base()
Base.prepare(engine, reflect = True)
Measurement = Base.classes.measurement
Station = Base.classes.station



#################################################
# Flask Setup
#################################################
app = Flask(__name__)


#################################################
# Flask Routes
# I really struggeled with this one
# I worked in a group with several people to get this done
#################################################

@app.route("/")
def welcome():
    return (
        f"To see all precipitaiont data follow : /api/v1.0/precipitation<br/>"
        f"To see all station data follow : /api/v1.0/stations<br/>"
        f"To see all temperature data follow : /api/v1.0/tobs<br/>"
        f"To see all temperature data by start date follow and insert date (yyyy-mm-dd) : /api/v1.0/<start><br/>"
        f"To see all temperature data by start date and end date follow and insert date (yyyy-mm-dd) : /api/v1.0/<start><end>"
    )


#precip route
@app.route('/api/v1.0/precipitation')
def precipitation():
    session = Session(engine)
    prcp = session.query(Measurement.date, Measurement.prcp).group_by(Measurement.date).all()
    results = list(np.ravel(prcp))
    session.close()
    return jsonify(results)

#station route
@app.route('/api/v1.0/stations')
def stations():
   session = Session(engine)
   stations = session.query(Measurement.station).group_by(Measurement.station).all()
   results = list(np.ravel(stations))
   session.close()
   return jsonify(results)

#tobs route
@app.route('/api/v1.0/tobs')
def tobs():
    session = Session(engine)
    temps = session.query(Measurement.date, Measurement.tobs).group_by(Measurement.date).all()
    results = list(np.ravel(temps))
    session.close()
    return jsonify(results)

#start date route
@app.route('/api/v1.0/<start>')
def start(start):
    session = Session(engine)
    data = session.query(func.min(Measurement.tobs), func.avg(Measurement.tobs), func.max(Measurement.tobs)).filter(Measurement.date >= start).all()
    results = list(np.ravel(data))
    session.close()
    return jsonify(results)

#start and end day route
@app.route('/api/v1.0/<start>/<end>')
def start_end(start, end):
    session = Session(engine)
    data = session.query(func.min(Measurement.tobs), func.avg(Measurement.tobs), func.max(Measurement.tobs)).filter(Measurement.date >= start).filter(Measurement.date <= end).all()
    results = list(np.ravel(data))
    session.close()
    return jsonify(results)

# debug
if __name__ == '__main__':
    app.run(debug=False)

