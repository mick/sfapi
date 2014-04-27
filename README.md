## sfapi


#### Parking Citations

API for checking a State + License plate for outstanding citations.

##### Request citations

````
 // https://sfapi.herokuapp.com/citations/parking/{STATE}/{PLATE}.json

curl "https://sfapi.herokuapp.com/citations/parking/CA/111111.json"
````

##### No citations found:

````
{
    "plate":"111111",
    "count":0,
    "plateAmount":0,
    "totalAmount":0,
    "processingFee":0,
    "citations":[]
}

````

##### Citations found:

````
{
  "plate": "111111",
  "count": 2,
  "plateAmount": 138,
  "totalAmount": 140.5,
  "processingFee": 2.5,
  "state": "CA",
  "citations": [
    {
      "citationNumber": "000000001",
      "issueDate": 1398124800,
      "violationCode": "TRC7.2.20",
      "violation": "RESIDENTIAL OVERTIME",
      "amount": 74
    },
    {
      "citationNumber": "000000002",
      "issueDate": 1398211200,
      "violationCode": "TRC7.2.22",
      "violation": "STREET CLEANING",
      "amount": 64
    }
  ]
}
````
