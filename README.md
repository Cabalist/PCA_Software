# PCA_Software


# Deployment:

  1. Get latest code from github:
  
  sudo apt-get install git; git clone https://github.com/agilman/PCA_Software

  2. Install python and virtualenv:

  sudo apt-get install python3 python3-pip virtualenvwrapper

  3. Need to reset terminal for virtualenvwrap aliases to take effect... afterward create virtualenv:

  mkvirtualenv py3-pca-env

  4. Specify python3 for the newly created virtualenv:

  virtualenv -p /usr/bin/python3 ~/.virtualenvs/py3-pca-env

  5. Get project dependencies in virtualenv:

  cd PCA_Software; pip3 install -r requirements.txt

  6. Init database:

  cd pca_project ; python manage.py migrate

  7. Run server:

  python manage.py runserver