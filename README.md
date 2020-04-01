# coronavirus-data-hub
fetch data from repo Johns Hopkins


## Usage

* command to build
    * `npm run start`


## File Structure
* `dist`
    * contain two files
        1. china-coronavirus-timeseries
        2. latest-coronavirus-stats

* `log`
    * log
        1. error.json
        2. history.json


## CI/CD Note

* prerequisite
    1. aws instance
    2. gtihub repo

* steps
    1. install AWS CLI on local machine (my mac book pro)
    2. install CodeDeploy agent on ec2 instance
        * [ref](https://docs.aws.amazon.com/codedeploy/latest/userguide/codedeploy-agent-operations-install-linux.html)
    3. create service role
        * https://docs.aws.amazon.com/codedeploy/latest/userguide/getting-started-create-service-role.html

* refs
    * https://docs.aws.amazon.com/codedeploy/latest/userguide/tutorials-github-create-application.html

## TODO
* [ ] ~~CI/CD~~
* [X] Encrypt/Decrypt secret Key
* [X] node/npm path in crontab

## Data Soruce
* [COVID-19 Johns Hopkins](https://github.com/CSSEGISandData/COVID-19)
* [Countries Name Translation Table](https://www.mofa.gov.tw/News_Content_M_2.aspx?n=A30D6E978846B3C0&sms=BA727B25FD99C6CC&s=6B456DA895AB3809)

## Public Data
* [Time Series](https://tpts-public.s3-ap-southeast-1.amazonaws.com/china-coronavirus-timeseries.json)
* [Latest](https://tpts-public.s3-ap-southeast-1.amazonaws.com/latest-coronavirus-stats.json)
