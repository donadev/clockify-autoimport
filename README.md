# Clockify Autoimport

Simple script able to automatically generate Clockify timesheets, based on a textual representation of your day work, working with GPT4.


## Getting Started
### Installing


Create a .env file and put inside the following:

    WORKSPACE_ID=<YOUR CLOCKIFY PROJECT ID>
    CLOCKIFY_API_KEY=<YOUR CLOCKIFY API KEY>

And run the script

    node-ts index.ts

The script will:
- fetch your clockify projects and tasks;
- ask for your day text representation;
- generate a GPT4 prompt that you can paste: GPT will download the csv file to import on Clockify.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code
of conduct, and the process for submitting pull requests to us.


## Authors

  - **Luigi Donadel**



## License

This project is licensed under the [CC0 1.0 Universal](LICENSE.md)
Creative Commons License - see the [LICENSE.md](LICENSE.md) file for
details

## Acknowledgments

  - Hat tip to anyone whose code is used
  - Inspiration
  - etc
