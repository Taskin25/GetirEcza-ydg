pipeline {
  agent any

  stages {
    stage('1- Checkout (GitHub)') {
      steps {
        checkout scm
        bat 'git rev-parse --short HEAD'
        bat 'git branch --show-current'
      }
    }

    stage('2- Build (Backend)') {
      steps {
        dir('backend') {
          bat 'mvn -B -DskipUTs=true -DskipITs=true package'
        }
      }
    }

    stage('2.1- Build (Frontend Image via Docker)') {
      steps {
        bat 'docker compose build frontend'
      }
    }

    stage('3- Unit Tests') {
      steps {
        dir('backend') {
          bat 'mvn -B test'
        }
      }
      post {
        always {
          junit testResults: 'backend/target/surefire-reports/*.xml'
        }
      }
    }

    // ⚠️ Burada "verify" koşturma.
    // Çünkü UrunSystemIT gibi sistem testlerin HTTP ile canlı backend ister.
    // (ControllerIT vs. gibi Testcontainers IT'lerin varsa ve onları burada koşturmak istiyorsan,
    // bunu pom'da ayrı profile ile ayırmak en temiz yol.)
    // stage('4- Integration Tests') { ... }  // şimdilik kaldırdım

stage('5- Run System on Docker Containers') {
  steps {
    bat 'docker compose up -d --build'

    powershell '''
      $ErrorActionPreference = "SilentlyContinue"
      $url = "http://localhost:8082/api/urunler"

      for ($i = 1; $i -le 60; $i++) {
        try {
          $r = Invoke-WebRequest -UseBasicParsing -TimeoutSec 2 $url
          if ($r.StatusCode -ge 200 -and $r.StatusCode -lt 500) {
            Write-Host "System is up: $($r.StatusCode)"
            exit 0
          }
        } catch {}
        Start-Sleep -Seconds 2
      }

      Write-Host "System did not become ready in time"
      exit 1
    '''
  }
}


    // ✅ 5'ten sonra System IT koşulur.
    // DİKKAT: senin docker ps çıktında backend host portu 8082 idi (8082 -> 8081).
    stage('5.1- System Tests (Backend HTTP)') {
      steps {
        dir('backend') {
          bat 'mvn -B test "-Dtest=internetprog.GetirEcza.system.UrunSystemIT" "-DAPP_API_BASE=http://localhost:8082"'
        }
      }
      post {
        always {
          junit testResults: 'backend/target/surefire-reports/*.xml'
        }
      }
    }

    // ✅ Selenium testleri host'tan koşuyor, bu yüzden APP_BASE_URL localhost olmalı.
    stage('6.1- Selenium Scenario #1 (Admin ürün ekle & sil)') {
      steps {
        dir('selenium-tests') {
          bat '''
mvn -B ^
  "-Dtest=internetprog.GetirEcza.selenium.S1_AdminUrunEkleSilTest" ^
  "-DAPP_BASE_URL=http://frontend" ^
  "-DSELENIUM_REMOTE_URL=http://localhost:4444/wd/hub" ^
  test
'''
        }
      }
      post { always { junit 'selenium-tests/target/surefire-reports/*.xml' } }
    }

    stage('6.2- Selenium Scenario #2 (User sepete ekle)') {
      steps {
        dir('selenium-tests') {
          bat '''
mvn -B ^
  "-Dtest=internetprog.GetirEcza.selenium.S2_UserSepeteEkleTest" ^
  "-DAPP_BASE_URL=http://frontend" ^
  "-DSELENIUM_REMOTE_URL=http://localhost:4444/wd/hub" ^
  test
'''
        }
      }
      post { always { junit 'selenium-tests/target/surefire-reports/*.xml' } }
    }

    stage('6.3- Selenium Scenario #3 (Favori & yorum)') {
      steps {
        dir('selenium-tests') {
          bat '''
mvn -B ^
  "-Dtest=internetprog.GetirEcza.selenium.S3_FavoriYorumTest" ^
  "-DAPP_BASE_URL=http://frontend" ^
  "-DSELENIUM_REMOTE_URL=http://localhost:4444/wd/hub" ^
  test
'''
        }
      }
      post { always { junit 'selenium-tests/target/surefire-reports/*.xml' } }
    }

    stage('6.4- Selenium Scenario #4 (Sayfalar açılıyor mu)') {
      steps {
        dir('selenium-tests') {
          bat '''
    mvn -B ^
      "-Dtest=internetprog.GetirEcza.selenium.S4_SayfalarAciliyorTest" ^
      "-DAPP_BASE_URL=http://frontend" ^
      "-DSELENIUM_REMOTE_URL=http://localhost:4444/wd/hub" ^
      test
    '''
        }
      }
      post { always { junit 'selenium-tests/target/surefire-reports/*.xml' } }
    }

    stage('6.5- Selenium Scenario #5 (Ürün liste & detay)') {
      steps {
        dir('selenium-tests') {
          bat '''
    mvn -B ^
      "-Dtest=internetprog.GetirEcza.selenium.S5_UrunListeDetayTest" ^
      "-DAPP_BASE_URL=http://frontend" ^
      "-DSELENIUM_REMOTE_URL=http://localhost:4444/wd/hub" ^
      test
    '''
        }
      }
      post { always { junit 'selenium-tests/target/surefire-reports/*.xml' } }
    }


  }

  post {
    always {
      bat 'docker compose down -v'
    }
  }
}
