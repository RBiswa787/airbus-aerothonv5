# Team Aviators

## Theme
To design a Data Lake based architecture for a washing machine manufacturing industry use-case.


## Our Solution
### Tech Stack
* ReactJS
* Flask API
* PostgreSQL
* Airbyte 
* dbt core
* Apache Superset
* Docker

### Architecture 
<br>
![alt text](https://github.com/RBiswa787/airbus-aerothonv5/blob/main/assets/archi.png?raw=true)
<br>

### Explanation

Different departments can upload CSV files containing department specific data via ReactJS based frontend.
JWT token based authentication is implemented to restrict access to data upload platform.
A python script running in the Flask based backend converts received CSV to DataFrame, connects to PostgreSQL service running on Docker container and writes to it.

This acts as our primary data storage. Next we used self-hosted Airbyte ELT tool to extract data from PostgreSQL primary DB to destination PostgreSQL DB acting as datalake. Cron jobs are configured in Airbyte to periodically sync the two databases making it near real time.

DBT or Data Build Tool can be used to apply relevant transformation to the data loaded in data lake such as normalisation and redundancy removal, merges etc..
Using an ELT pipeline instead of ELT avoids writing corrupt data to data lake in case of transformation failures.

A docker hosted Apache Superset data visualisation tool was connected to the PostgreSQL datalake. The same can be used to generate dashboards and interactive charts for monitoring and forecast purpose.


### Presentation PDF
https://github.com/RBiswa787/airbus-aerothonv5/tree/main/assets/Team Aviators-Airbus Aerothon 5.0.pdf